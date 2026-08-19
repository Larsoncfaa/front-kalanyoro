import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";

import { useDashboard } from "../../hooks/useDashboard";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function Dashboard() {
  const { stats, loading, error } = useDashboard();
  const { user } = useCurrentUser();

  const isAdmin = user?.role === "ADMIN";

  const cards = [
    {
      title: "Étudiants",
      value: stats?.studentsCount ?? "—",
      icon: <PeopleAltIcon />,
      color: "#059669",
    },
    {
      title: "Sessions Darasa",
      value: stats?.sessionsCount ?? "—",
      icon: <MenuBookIcon />,
      color: "#2563eb",
    },
    {
      title: "Progressions",
      value: stats?.progressCount ?? "—",
      icon: <TrendingUpIcon />,
      color: "#d97706",
    },
    {
      title: "Enseignants",
      value: stats?.teachersCount ?? "—",
      icon: <SchoolIcon />,
      color: "#7c3aed",
    },
  ];

  const teacherCards = [
    {
      title: "Mes étudiants",
      value: stats?.studentsCount ?? "—",
      icon: <PeopleAltIcon />,
      color: "#059669",
    },
    {
      title: "Mes séances Darasa",
      value: stats?.sessionsCount ?? "—",
      icon: <MenuBookIcon />,
      color: "#2563eb",
    },
    {
      title: "Progressions",
      value: stats?.progressCount ?? "—",
      icon: <TrendingUpIcon />,
      color: "#d97706",
    },
  ];

  const renderCard = (card: any) => (
    <Paper
      key={card.title}
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: {
          xs: 2.5,
          sm: 3,
        },
        minHeight: {
          xs: 145,
          sm: 165,
        },
        borderRadius: {
          xs: 3,
          sm: 4,
        },
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        transition: "all 0.25s ease",
        cursor: "default",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          backgroundColor: card.color,
        },

        "&:hover": {
          transform: {
            xs: "none",
            sm: "translateY(-5px)",
          },
          borderColor: `${card.color}35`,
          boxShadow: {
            xs: "none",
            sm: "0 18px 40px rgba(15, 23, 42, 0.08)",
          },
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontSize: {
                xs: "0.82rem",
                sm: "0.875rem",
              },
              mb: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {card.title}
          </Typography>

          <Typography
            sx={{
              color: "#0f172a",
              fontWeight: 800,
              lineHeight: 1,
              fontSize: {
                xs: "2rem",
                sm: "2.35rem",
              },
            }}
          >
            {card.value}
          </Typography>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            width: {
              xs: 48,
              sm: 58,
            },
            height: {
              xs: 48,
              sm: 58,
            },
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${card.color}12`,
            color: card.color,

            "& svg": {
              fontSize: {
                xs: 24,
                sm: 29,
              },
            },
          }}
        >
          {card.icon}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        px: {
          xs: 0,
          sm: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: {
            xs: 3,
            sm: 4,
          },
          p: {
            xs: 2.5,
            sm: 3,
            md: 3.5,
          },
          borderRadius: {
            xs: 3,
            sm: 4,
          },
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontSize: {
                  xs: "1.45rem",
                  sm: "1.75rem",
                  md: "2rem",
                },
                lineHeight: 1.2,
                mb: 0.8,
              }}
            >
              {isAdmin
                ? "Tableau de bord administrateur"
                : "Espace utilisateur"}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: {
                  xs: "0.875rem",
                  sm: "0.95rem",
                },
                lineHeight: 1.5,
                maxWidth: 650,
              }}
            >
              {isAdmin
                ? "Suivi des activités de gestion Coran"
                : "Vue synthétique de votre activité"}
            </Typography>
          </Box>

          <Chip
            label={isAdmin ? "Administrateur" : "Enseignant"}
            color={isAdmin ? "success" : "default"}
            sx={{
              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
              height: 34,
              borderRadius: 2,
              fontWeight: 700,
              px: 0.5,
              backgroundColor: isAdmin ? "#ecfdf5" : "#f1f5f9",
              color: isAdmin ? "#047857" : "#475569",
              border: `1px solid ${
                isAdmin ? "#a7f3d0" : "#e2e8f0"
              }`,
            }}
          />
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Statistics */}
      {!loading && (
        <Box
          sx={{
            display: "grid",
            gap: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: isAdmin
                ? "repeat(4, minmax(0, 1fr))"
                : "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {(isAdmin ? cards : teacherCards).map(renderCard)}
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;