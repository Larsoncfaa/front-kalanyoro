import { useState } from "react";

import {
  Box,
  Alert,
  Chip,
  CircularProgress,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useCurriculum } from "../../hooks/useCurriculum";
import type { CurriculumLevel } from "../../api/curriculum.api";

import {
  createCurriculumLevel,
  updateCurriculumLevel,
  deleteCurriculumLevel,
} from "../../api/curriculum.api";

function Curriculum() {
  const { levels, loading, error, reload } = useCurriculum();

  // =========================================================
  // ÉTAT DU FORMULAIRE
  // =========================================================

  const [openDialog, setOpenDialog] = useState(false);

  const [editingLevel, setEditingLevel] =
    useState<CurriculumLevel | null>(null);

  const [levelNumber, setLevelNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);

  // =========================================================
  // OUVRIR POUR CRÉATION
  // =========================================================

  const handleOpenCreate = () => {
    setEditingLevel(null);

    setLevelNumber("");
    setName("");
    setDescription("");
    setIsActive(true);

    setOpenDialog(true);
  };

  // =========================================================
  // OUVRIR POUR MODIFICATION
  // =========================================================

  const handleOpenEdit = (level: CurriculumLevel) => {
    setEditingLevel(level);

    setLevelNumber(String(level.level_number));
    setName(level.name);
    setDescription(level.description);
    setIsActive(level.is_active);

    setOpenDialog(true);
  };

  // =========================================================
  // FERMER LE DIALOG
  // =========================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
  };

  // =========================================================
  // ENREGISTRER
  // =========================================================

  const handleSave = async () => {
    if (!levelNumber || !name.trim()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        level_number: Number(levelNumber),
        name: name.trim(),
        description: description.trim(),
        is_active: isActive,
      };

      if (editingLevel) {
        await updateCurriculumLevel(editingLevel.id, payload);
      } else {
        await createCurriculumLevel(payload);
      }

      setOpenDialog(false);

      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement du niveau :",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SUPPRIMER
  // =========================================================

  const handleDelete = async (level: CurriculumLevel) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le niveau "${level.name}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCurriculumLevel(level.id);

      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de la suppression du niveau :",
        err
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
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // ERREUR
  // =========================================================

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error}
      </Alert>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "1.65rem",
                sm: "2rem",
                md: "2.2rem",
              },
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            Parcours curriculum islamique
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.6,
              maxWidth: 850,
            }}
          >
            Progression par maîtrise, micro-compétences et
            validation pratique à chaque niveau.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
            minHeight: 44,
            borderRadius: 2.5,
            px: 2.5,
            whiteSpace: "nowrap",
          }}
        >
          Ajouter un niveau
        </Button>
      </Box>

      {/* =====================================================
          LISTE DES NIVEAUX
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, sm: 3 },
        }}
      >
        {levels.map((level) => (
          <Paper
            key={level.id}
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: { xs: 3, sm: 4 },
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            {/* =================================================
                HEADER NIVEAU
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: {
                        xs: "1.05rem",
                        sm: "1.25rem",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {level.name}
                  </Typography>

                  {!level.is_active && (
                    <Chip
                      label="Inactif"
                      color="default"
                      size="small"
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {level.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: {
                    xs: "center",
                    sm: "center",
                  },
                  justifyContent: {
                    xs: "space-between",
                    sm: "flex-end",
                  },
                  gap: 1,
                  flexWrap: "wrap",
                  flexShrink: 0,
                }}
              >
                <Chip
                  icon={<SchoolIcon />}
                  label={`Niveau ${level.level_number}`}
                  color="success"
                  size="small"
                />

                <IconButton
                  color="primary"
                  onClick={() => handleOpenEdit(level)}
                  title="Modifier"
                  size="small"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(level)}
                  title="Supprimer"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ mb: { xs: 2, sm: 2.5 } }} />

            {/* =================================================
                MODULES
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {level.modules?.map((module) => (
                <Paper
                  key={module.id}
                  variant="outlined"
                  sx={{
                    p: { xs: 1.5, sm: 2.5 },
                    borderRadius: { xs: 2.5, sm: 3 },
                    overflow: "hidden",
                  }}
                >
                  {/* MODULE HEADER */}

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
                        sm: "center",
                      },
                      gap: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          wordBreak: "break-word",
                        }}
                      >
                        {module.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.25,
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {module.description}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        flexShrink: 0,
                      }}
                    >
                      <Chip
                        icon={<MenuBookIcon />}
                        label={`${module.duration_minutes} min`}
                        size="small"
                      />

                      {module.is_required && (
                        <Chip
                          label="Obligatoire"
                          color="primary"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>

                  {/* =================================================
                      LEÇONS
                  ================================================= */}

                  {module.lessons?.map((lesson) => (
                    <Box
                      key={lesson.id}
                      sx={{
                        mt: 2,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        overflow: "hidden",
                      }}
                    >
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
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              wordBreak: "break-word",
                            }}
                          >
                            {lesson.title}
                          </Typography>

                          {lesson.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                lineHeight: 1.5,
                                wordBreak: "break-word",
                              }}
                            >
                              {lesson.description}
                            </Typography>
                          )}
                        </Box>

                        <Chip
                          label={`${lesson.duration_minutes} min`}
                          size="small"
                          sx={{
                            alignSelf: {
                              xs: "flex-start",
                              sm: "flex-start",
                            },
                            flexShrink: 0,
                          }}
                        />
                      </Box>

                      {/* =================================================
                          COMPÉTENCES
                      ================================================= */}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        {lesson.competencies?.map(
                          (competency) => (
                            <Box
                              key={competency.id}
                              sx={{
                                display: "flex",
                                flexDirection: {
                                  xs: "column",
                                  sm: "row",
                                },
                                justifyContent:
                                  "space-between",
                                alignItems: {
                                  xs: "stretch",
                                  sm: "center",
                                },
                                gap: 1.5,
                                px: {
                                  xs: 1.25,
                                  sm: 1.5,
                                },
                                py: 1,
                                borderRadius: 2,
                                bgcolor:
                                  competency.is_gate
                                    ? "#fef3c7"
                                    : "#ffffff",
                                border:
                                  "1px solid rgba(226,232,240,0.7)",
                              }}
                            >
                              <Box
                                sx={{
                                  minWidth: 0,
                                  flex: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 600,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {competency.title}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    lineHeight: 1.5,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {competency.description}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 1,
                                  flexWrap: "wrap",
                                  flexShrink: 0,
                                  alignSelf: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                }}
                              >
                                {competency.is_gate && (
                                  <Chip
                                    label="Gate"
                                    color="warning"
                                    size="small"
                                  />
                                )}

                                <CheckCircleIcon
                                  color="success"
                                  fontSize="small"
                                />
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  ))}
                </Paper>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* =========================================================
          DIALOG — CRÉER / MODIFIER UN NIVEAU
      ========================================================= */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: {
              xs: 2,
              sm: 4,
            },
            mx: {
              xs: 1,
              sm: 2,
            },
            width: {
              xs: "calc(100% - 16px)",
              sm: "100%",
            },
            maxHeight: {
              xs: "calc(100% - 32px)",
              sm: "calc(100% - 64px)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
            },
          }}
        >
          {editingLevel
            ? "Modifier le niveau"
            : "Ajouter un niveau"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 2.5 },
              pt: 1,
            }}
          >
            <TextField
              label="Numéro du niveau"
              type="number"
              value={levelNumber}
              onChange={(event) =>
                setLevelNumber(event.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Nom du niveau"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              fullWidth
              multiline
              rows={4}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                />
              }
              label="Niveau actif"
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 2 },
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              saving ||
              !levelNumber ||
              !name.trim()
            }
          >
            {saving
              ? "Enregistrement..."
              : editingLevel
                ? "Modifier"
                : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Curriculum;