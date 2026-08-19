import { useState } from "react";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { removeTokens, removeUser } from "../utils/token";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { UserRole } from "../types";

const drawerWidth = 260;

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useCurrentUser();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;

  const navigationItems = [
    {
      label: "Tableau de bord",
      path: "/dashboard",
      icon: <DashboardIcon />,
      requiredRole: undefined,
    },
    {
      label: "Étudiants",
      path: "/students",
      icon: <GroupsIcon />,
      requiredRole: undefined,
    },
    {
      label: "Enseignants",
      path: "/teachers",
      icon: <SchoolIcon />,
      requiredRole: UserRole.ADMIN,
    },
    {
      label: "Dars",
      path: "/darasa",
      icon: <MenuBookIcon />,
      requiredRole: undefined,
    },
    {
      label: "Progression de l'étudiant",
      path: "/progress",
      icon: <TrendingUpIcon />,
      requiredRole: undefined,
    },
    {
      label: "Curriculum",
      path: "/curriculum",
      icon: <SchoolIcon />,
      requiredRole: UserRole.ADMIN,
    },
    {
      label: "Validation niveaux",
      path: "/level-validation",
      icon: <FactCheckIcon />,
      requiredRole: undefined,
    },
    {
      label: "Rapports",
      path: "/reports",
      icon: <AssessmentIcon />,
      requiredRole: undefined,
    },
    {
      label: "Profil",
      path: "/profile",
      icon: <PersonIcon />,
      requiredRole: undefined,
    },
    {
      label: "Paramètres",
      path: "/settings",
      icon: <SettingsIcon />,
      requiredRole: undefined,
    },
  ].filter(
    (item) => !item.requiredRole || user?.role === item.requiredRole
  );

  const handleLogout = () => {
    removeTokens();
    removeUser();

    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(145deg, #0f766e 0%, #0f172a 100%)",
        color: "#fff",
      }}
    >
      {/* LOGO / BRAND */}
      <Box
        sx={{
          p: {
            xs: 2.5,
            sm: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              minWidth: 42,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.16)",
            }}
          >
            <SchoolIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Kalanyoro
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#b6f7ea",
              }}
            >
               Gestion
            </Typography>
          </Box>

          {isMobile && (
            <IconButton
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                ml: "auto",
                color: "#fff",
              }}
              aria-label="Fermer le menu"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "#d1fae5",
            mt: 2,
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          Espace de pilotage pédagogique
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.15)",
        }}
      />

      {/* NAVIGATION */}
      <List
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
          },
          mt: 2,
          overflowY: "auto",
          flex: 1,

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,.2)",
            borderRadius: 10,
          },
        }}
      >
        {navigationItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={handleNavigation}
              sx={{
                minHeight: 46,
                borderRadius: 2.5,
                mb: 0.75,
                color: "#d1fae5",

                backgroundColor: active
                  ? "rgba(255,255,255,.18)"
                  : "transparent",

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,.12)",
                },

                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: active ? 700 : 500,
                      color: "inherit",
                      fontSize: "0.94rem",
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* BOTTOM USER INFO */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#059669",
              fontWeight: 700,
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.username ?? "Utilisateur"}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#a7f3d0",
              }}
            >
              {isAdmin ? "Administrateur" : "Enseignant"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      {/* =====================================================
          SIDEBAR DESKTOP
      ===================================================== */}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "none",
              boxShadow:
                "18px 0 40px rgba(15, 23, 42, 0.18)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* =====================================================
          SIDEBAR MOBILE
      ===================================================== */}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: {
                xs: "85vw",
                sm: drawerWidth,
              },
              maxWidth: drawerWidth,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* =====================================================
          CONTENU PRINCIPAL
      ===================================================== */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ===================================================
            TOP BAR
        =================================================== */}

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            color: "#0f172a",
            borderBottom:
              "1px solid rgba(15, 118, 110, 0.1)",
            zIndex: (theme) => theme.zIndex.appBar,
          }}
        >
          <Toolbar
            sx={{
              minHeight: {
                xs: 64,
                sm: 72,
              },

              px: {
                xs: 1.5,
                sm: 3,
                md: 4,
              },

              gap: 1.5,
            }}
          >
            {/* MOBILE MENU */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileDrawerOpen(true)}
                sx={{
                  color: "#0f766e",
                  mr: 0.5,
                }}
                aria-label="Ouvrir le menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* TITLE */}
            <Box
              sx={{
                minWidth: 0,
                flexGrow: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.35rem",
                    md: "1.5rem",
                  },
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Espace administration
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  mt: 0.25,
                }}
              >
                Bienvenue {user?.username ?? "Utilisateur"}
              </Typography>
            </Box>

            {/* USER AREA */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: 0.75,
                  sm: 1.5,
                  md: 2,
                },
              }}
            >
              {/* ROLE */}
              <Chip
                label={isAdmin ? "Administrateur" : "Enseignant"}
                color={isAdmin ? "success" : "default"}
                size="small"
                sx={{
                  fontWeight: 600,

                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                }}
              />

              {/* AVATAR */}
              <Avatar
                sx={{
                  width: {
                    xs: 34,
                    sm: 40,
                  },

                  height: {
                    xs: 34,
                    sm: 40,
                  },

                  bgcolor: "#059669",
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1rem",
                  },
                  fontWeight: 700,
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </Avatar>

              {/* LOGOUT DESKTOP */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  display: {
                    xs: "none",
                    md: "inline-flex",
                  },

                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Déconnexion
              </Button>

              {/* LOGOUT MOBILE */}
              {isMobile && (
                <IconButton
                  color="error"
                  onClick={handleLogout}
                  aria-label="Déconnexion"
                  sx={{
                    display: {
                      xs: "flex",
                      md: "none",
                    },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <Box
          sx={{
            p: {
              xs: 1.5,
              sm: 2.5,
              md: 4,
            },

            flexGrow: 1,

            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;