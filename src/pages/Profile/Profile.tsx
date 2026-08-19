import { useState, useEffect } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useProfile } from "../../hooks/useProfile";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  new_password: string;
  confirm_password: string;
}

function Profile() {
  const {
    user,
    loading,
    error,
    success,
    updateProfile,
    clearMessages,
  } = useProfile();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    new_password: "",
    confirm_password: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  // =========================================================
  // INITIALISATION DU FORMULAIRE
  // =========================================================

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        new_password: "",
        confirm_password: "",
      });
    }
  }, [user]);

  // =========================================================
  // CHANGEMENT DES CHAMPS
  // =========================================================

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError(null);
  };

  // =========================================================
  // SAUVEGARDE PROFIL
  // =========================================================

  const handleSaveProfile = async () => {
    setFormError(null);

    if (!formData.first_name || !formData.last_name) {
      setFormError("Le prénom et le nom sont requis");
      return;
    }

    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      });

      setIsEditMode(false);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la sauvegarde"
      );
    }
  };

  // =========================================================
  // CHANGEMENT MOT DE PASSE
  // =========================================================

  const handleChangePassword = async () => {
    setFormError(null);

    if (
      !formData.new_password ||
      !formData.confirm_password
    ) {
      setFormError(
        "Veuillez entrer le nouveau mot de passe"
      );
      return;
    }

    if (
      formData.new_password !==
      formData.confirm_password
    ) {
      setFormError(
        "Les mots de passe ne correspondent pas"
      );
      return;
    }

    if (formData.new_password.length < 8) {
      setFormError(
        "Le mot de passe doit contenir au moins 8 caractères"
      );
      return;
    }

    try {
      await updateProfile({
        password: formData.new_password,
        password_confirm: formData.confirm_password,
      });

      setShowPasswordDialog(false);

      setFormData((prev) => ({
        ...prev,
        new_password: "",
        confirm_password: "",
      }));
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Erreur lors du changement de mot de passe"
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // USER ABSENT
  // =========================================================

  if (!user) {
    return (
      <Alert severity="error">
        Erreur : Impossible de charger le profil
      </Alert>
    );
  }

  // =========================================================
  // INFORMATIONS CALCULÉES
  // =========================================================

  const fullName =
    `${formData.first_name} ${formData.last_name}`.trim();

  const initials =
    `${formData.first_name.charAt(0)}${formData.last_name.charAt(
      0
    )}`.toUpperCase();

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          mb: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            fontSize: {
              xs: "1.75rem",
              sm: "2rem",
              md: "2.25rem",
            },
            lineHeight: 1.2,
          }}
        >
          Mon Profil
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            fontSize: {
              xs: "0.9rem",
              sm: "1rem",
            },
          }}
        >
          Gérez vos informations personnelles et vos
          paramètres de compte
        </Typography>
      </Box>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() => clearMessages()}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => clearMessages()}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          Profil mis à jour avec succès
        </Alert>
      )}

      {/* =====================================================
          PROFIL PRINCIPAL
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: {
            xs: 3,
            md: 4,
          },
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          mb: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
          overflow: "hidden",
        }}
      >
        {/* ===================================================
            PROFIL HEADER
        =================================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "flex-start",
            },
            gap: {
              xs: 2.5,
              sm: 3,
            },
          }}
        >
          {/* IDENTITÉ */}

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "center",
                sm: "center",
              },
              textAlign: {
                xs: "center",
                sm: "left",
              },
              gap: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{
                width: {
                  xs: 76,
                  sm: 90,
                  md: 100,
                },
                height: {
                  xs: 76,
                  sm: 90,
                  md: 100,
                },
                bgcolor: "#059669",
                fontSize: {
                  xs: 30,
                  sm: 36,
                  md: 40,
                },
                fontWeight: 700,
                flexShrink: 0,
                boxShadow:
                  "0 8px 24px rgba(5, 150, 105, 0.22)",
              }}
            >
              {initials}
            </Avatar>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.4rem",
                    md: "1.5rem",
                  },
                  overflowWrap: "anywhere",
                }}
              >
                {fullName}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  fontSize: "0.9rem",
                  overflowWrap: "anywhere",
                }}
              >
                @{user.username}
              </Typography>

              {/* BADGES */}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: {
                    xs: "center",
                    sm: "flex-start",
                  },
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    bgcolor:
                      user.role === "ADMIN"
                        ? "#dbeafe"
                        : "#dcfce7",
                    color:
                      user.role === "ADMIN"
                        ? "#0369a1"
                        : "#166534",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {user.role === "ADMIN"
                    ? "Administrateur"
                    : "Enseignant"}
                </Box>

                <Box
                  component="span"
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    bgcolor: user.is_active
                      ? "#dcfce7"
                      : "#fee2e2",
                    color: user.is_active
                      ? "#166534"
                      : "#7f1d1d",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {user.is_active
                    ? "Actif"
                    : "Inactif"}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ACTIONS */}

          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              flexShrink: 0,
            }}
          >
            {!isEditMode ? (
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() =>
                  setIsEditMode(true)
                }
                sx={{
                  minHeight: 44,
                  px: 2.5,
                  background:
                    "linear-gradient(135deg, #0f766e, #059669)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow:
                    "0 6px 16px rgba(15, 118, 110, 0.18)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #115e59, #047857)",
                  },
                }}
              >
                Modifier le profil
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                  sx={{
                    minHeight: 44,
                    px: 2,
                    background:
                      "linear-gradient(135deg, #0f766e, #059669)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Enregistrer
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() =>
                    setIsEditMode(false)
                  }
                  sx={{
                    minHeight: 44,
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Annuler
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider
          sx={{
            my: {
              xs: 2.5,
              sm: 3,
              md: 4,
            },
          }}
        />

        {/* ===================================================
            FORMULAIRE
        =================================================== */}

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* PRÉNOM */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.first_name}
              onChange={(e) =>
                handleInputChange(
                  "first_name",
                  e.target.value
                )
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{ color: "#0f766e" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          {/* NOM */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.last_name}
              onChange={(e) =>
                handleInputChange(
                  "last_name",
                  e.target.value
                )
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{ color: "#0f766e" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          {/* EMAIL */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange(
                  "email",
                  e.target.value
                )
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        sx={{ color: "#0f766e" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          {/* TÉLÉPHONE */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.phone}
              onChange={(e) =>
                handleInputChange(
                  "phone",
                  e.target.value
                )
              }
              disabled={!isEditMode || loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon
                        sx={{ color: "#0f766e" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Grid>

          {/* USERNAME */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={user.username}
              disabled
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon
                        sx={{ color: "#0f766e" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              helperText="Le nom d'utilisateur ne peut pas être modifié"
            />
          </Grid>

          {/* MOT DE PASSE */}

          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() =>
                setShowPasswordDialog(true)
              }
              disabled={loading}
              sx={{
                height: 56,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#0f766e",
                color: "#0f766e",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#0f766e",
                  bgcolor: "rgba(15, 118, 110, 0.05)",
                },
              }}
            >
              Changer le mot de passe
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* =====================================================
          STATISTIQUES
      ===================================================== */}

      <Grid
        container
        spacing={{ xs: 2, sm: 2.5, md: 3 }}
      >
        {/* RÔLE */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 8px 24px rgba(15, 23, 42, 0.08)",
              },
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },
              }}
            >
              <Typography
                color="text.secondary"
                gutterBottom
              >
                Rôle
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  overflowWrap: "anywhere",
                }}
              >
                {user.role === "ADMIN"
                  ? "Administrateur"
                  : "Enseignant"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* STATUT */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 8px 24px rgba(15, 23, 42, 0.08)",
              },
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },
              }}
            >
              <Typography
                color="text.secondary"
                gutterBottom
              >
                Statut
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: user.is_active
                    ? "#059669"
                    : "#dc2626",
                }}
              >
                {user.is_active
                  ? "Actif"
                  : "Inactif"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ID */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 8px 24px rgba(15, 23, 42, 0.08)",
              },
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },
              }}
            >
              <Typography
                color="text.secondary"
                gutterBottom
              >
                ID Utilisateur
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                #{user.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* MEMBRE DEPUIS */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 8px 24px rgba(15, 23, 42, 0.08)",
              },
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },
              }}
            >
              <Typography
                color="text.secondary"
                gutterBottom
              >
                Membre depuis
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: 14,
                    sm: 15,
                  },
                }}
              >
                {user.created_at
                  ? new Date(
                      user.created_at
                    ).toLocaleDateString("fr-FR")
                  : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =====================================================
          DIALOG MOT DE PASSE
      ===================================================== */}

      <Dialog
        open={showPasswordDialog}
        onClose={() => {
          if (loading) return;

          setShowPasswordDialog(false);
          setFormError(null);
        }}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: {
              xs: 0,
              sm: 3,
            },
            mx: {
              xs: 0,
              sm: 2,
            },
            width: {
              xs: "100%",
              sm: "calc(100% - 32px)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            px: {
              xs: 2,
              sm: 3,
            },
            pt: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          Changer le mot de passe
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
            pt: "16px !important",
          }}
        >
          {formError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              {formError}
            </Alert>
          )}

          {/* NOUVEAU MOT DE PASSE */}

          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type={
              showPasswords.new
                ? "text"
                : "password"
            }
            value={formData.new_password}
            onChange={(e) =>
              handleInputChange(
                "new_password",
                e.target.value
              )
            }
            disabled={loading}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      edge="end"
                      disabled={loading}
                      aria-label={
                        showPasswords.new
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPasswords.new ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* CONFIRMATION */}

          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            type={
              showPasswords.confirm
                ? "text"
                : "password"
            }
            value={formData.confirm_password}
            onChange={(e) =>
              handleInputChange(
                "confirm_password",
                e.target.value
              )
            }
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      edge="end"
                      disabled={loading}
                      aria-label={
                        showPasswords.confirm
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPasswords.confirm ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1.5,
              display: "block",
              lineHeight: 1.5,
            }}
          >
            Le mot de passe doit contenir au moins
            8 caractères.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            gap: 1,
            "& > button": {
              width: {
                xs: "100%",
                sm: "auto",
              },
              minHeight: 44,
            },
          }}
        >
          <Button
            onClick={() => {
              setShowPasswordDialog(false);
              setFormError(null);
            }}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Annuler
          </Button>

          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={loading}
            sx={{
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, #115e59, #047857)",
              },
            }}
          >
            {loading
              ? "Modification..."
              : "Changer le mot de passe"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;