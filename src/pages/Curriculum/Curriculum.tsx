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
import PlayLessonIcon from "@mui/icons-material/PlayLesson";

import { useCurriculum } from "../../hooks/useCurriculum";

import type {
  CurriculumLevel,
  CurriculumModule,
  CurriculumLesson,
} from "../../api/curriculum.api";

import {
  createCurriculumLevel,
  updateCurriculumLevel,
  deleteCurriculumLevel,
  createCurriculumModule,
  updateCurriculumModule,
  deleteCurriculumModule,
  createCurriculumLesson,
  updateCurriculumLesson,
  deleteCurriculumLesson,
} from "../../api/curriculum.api";

function Curriculum() {
  const { levels, loading, error, reload } = useCurriculum();

  // =========================================================
  // ÉTAT GÉNÉRAL
  // =========================================================

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogType, setDialogType] = useState<
    "level" | "module" | "lesson"
  >("level");

  const [saving, setSaving] = useState(false);

  // =========================================================
  // NIVEAU
  // =========================================================

  const [editingLevel, setEditingLevel] =
    useState<CurriculumLevel | null>(null);

  const [levelNumber, setLevelNumber] = useState("");
  const [levelName, setLevelName] = useState("");
  const [levelDescription, setLevelDescription] = useState("");
  const [levelIsActive, setLevelIsActive] = useState(true);

  // =========================================================
  // MODULE
  // =========================================================

  const [editingModule, setEditingModule] =
    useState<CurriculumModule | null>(null);

  const [moduleLevel, setModuleLevel] = useState<number | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleOrder, setModuleOrder] = useState("");
  const [moduleDuration, setModuleDuration] = useState("20");
  const [moduleIsRequired, setModuleIsRequired] = useState(true);

  // =========================================================
  // LEÇON
  // =========================================================

  const [editingLesson, setEditingLesson] =
    useState<CurriculumLesson | null>(null);

  const [lessonModule, setLessonModule] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonObjectives, setLessonObjectives] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonOrder, setLessonOrder] = useState("");
  const [lessonDuration, setLessonDuration] = useState("10");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonIsRequired, setLessonIsRequired] = useState(true);

  // =========================================================
  // RESET
  // =========================================================

  const resetDialog = () => {
    setEditingLevel(null);
    setEditingModule(null);
    setEditingLesson(null);

    setLevelNumber("");
    setLevelName("");
    setLevelDescription("");
    setLevelIsActive(true);

    setModuleLevel(null);
    setModuleTitle("");
    setModuleDescription("");
    setModuleOrder("");
    setModuleDuration("20");
    setModuleIsRequired(true);

    setLessonModule(null);
    setLessonTitle("");
    setLessonObjectives("");
    setLessonDescription("");
    setLessonOrder("");
    setLessonDuration("10");
    setLessonContent("");
    setLessonIsRequired(true);
  };

  // =========================================================
  // CRÉER NIVEAU
  // =========================================================

  const handleOpenCreateLevel = () => {
    resetDialog();

    setDialogType("level");
    setOpenDialog(true);
  };

  // =========================================================
  // MODIFIER NIVEAU
  // =========================================================

  const handleOpenEditLevel = (level: CurriculumLevel) => {
    resetDialog();

    setDialogType("level");
    setEditingLevel(level);

    setLevelNumber(String(level.level_number));
    setLevelName(level.name);
    setLevelDescription(level.description);
    setLevelIsActive(level.is_active);

    setOpenDialog(true);
  };

  // =========================================================
  // CRÉER MODULE
  // =========================================================

  const handleOpenCreateModule = (level: CurriculumLevel) => {
    resetDialog();

    setDialogType("module");
    setModuleLevel(level.id);

    const nextOrder = (level.modules?.length ?? 0) + 1;
    setModuleOrder(String(nextOrder));

    setOpenDialog(true);
  };

  // =========================================================
  // MODIFIER MODULE
  // =========================================================

  const handleOpenEditModule = (module: CurriculumModule) => {
    resetDialog();

    setDialogType("module");
    setEditingModule(module);

    setModuleLevel(module.level);
    setModuleTitle(module.title);
    setModuleDescription(module.description);
    setModuleOrder(String(module.order));
    setModuleDuration(String(module.duration_minutes));
    setModuleIsRequired(module.is_required);

    setOpenDialog(true);
  };

  // =========================================================
  // CRÉER LEÇON
  // =========================================================

  const handleOpenCreateLesson = (module: CurriculumModule) => {
    resetDialog();

    setDialogType("lesson");
    setLessonModule(module.id);

    const nextOrder = (module.lessons?.length ?? 0) + 1;
    setLessonOrder(String(nextOrder));

    setOpenDialog(true);
  };

  // =========================================================
  // MODIFIER LEÇON
  // =========================================================

  const handleOpenEditLesson = (lesson: CurriculumLesson) => {
    resetDialog();

    setDialogType("lesson");
    setEditingLesson(lesson);

    setLessonModule(lesson.module);
    setLessonTitle(lesson.title);
    setLessonObjectives(lesson.objectives);
    setLessonDescription(lesson.description);
    setLessonOrder(String(lesson.order));
    setLessonDuration(String(lesson.duration_minutes));
    setLessonContent(lesson.content);
    setLessonIsRequired(lesson.is_required);

    setOpenDialog(true);
  };

  // =========================================================
  // FERMER DIALOG
  // =========================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    resetDialog();
  };

  // =========================================================
  // ENREGISTRER
  // =========================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      // =====================================================
      // NIVEAU
      // =====================================================

      if (dialogType === "level") {
        if (!levelNumber || !levelName.trim()) {
          return;
        }

        const payload = {
          level_number: Number(levelNumber),
          name: levelName.trim(),
          description: levelDescription.trim(),
          is_active: levelIsActive,
        };

        if (editingLevel) {
          await updateCurriculumLevel(
            editingLevel.id,
            payload
          );
        } else {
          await createCurriculumLevel(payload);
        }
      }

      // =====================================================
      // MODULE
      // =====================================================

      if (dialogType === "module") {
        if (
          !moduleLevel ||
          !moduleTitle.trim() ||
          !moduleOrder
        ) {
          return;
        }

        const payload = {
          level: moduleLevel,
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
          order: Number(moduleOrder),
          duration_minutes: Number(moduleDuration),
          is_required: moduleIsRequired,
        };

        if (editingModule) {
          await updateCurriculumModule(
            editingModule.id,
            payload
          );
        } else {
          await createCurriculumModule(payload);
        }
      }

      // =====================================================
      // LEÇON
      // =====================================================

      if (dialogType === "lesson") {
        if (
          !lessonModule ||
          !lessonTitle.trim() ||
          !lessonOrder
        ) {
          return;
        }

        const payload = {
          module: lessonModule,
          title: lessonTitle.trim(),
          objectives: lessonObjectives.trim(),
          description: lessonDescription.trim(),
          order: Number(lessonOrder),
          duration_minutes: Number(lessonDuration),
          is_required: lessonIsRequired,
          content: lessonContent.trim(),
        };

        if (editingLesson) {
          await updateCurriculumLesson(
            editingLesson.id,
            payload
          );
        } else {
          await createCurriculumLesson(payload);
        }
      }

      setOpenDialog(false);
      resetDialog();

      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de l'enregistrement du curriculum :",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SUPPRIMER NIVEAU
  // =========================================================

  const handleDeleteLevel = async (
    level: CurriculumLevel
  ) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le niveau "${level.name}" ?\n\nAttention : les modules et leçons associés seront également supprimés.`
    );

    if (!confirmed) return;

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
  // SUPPRIMER MODULE
  // =========================================================

  const handleDeleteModule = async (
    module: CurriculumModule
  ) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le module "${module.title}" ?\n\nLes leçons associées seront également supprimées.`
    );

    if (!confirmed) return;

    try {
      await deleteCurriculumModule(module.id);
      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de la suppression du module :",
        err
      );
    }
  };

  // =========================================================
  // SUPPRIMER LEÇON
  // =========================================================

  const handleDeleteLesson = async (
    lesson: CurriculumLesson
  ) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la leçon "${lesson.title}" ?`
    );

    if (!confirmed) return;

    try {
      await deleteCurriculumLesson(lesson.id);
      await reload();
    } catch (err) {
      console.error(
        "Erreur lors de la suppression de la leçon :",
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
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
              lineHeight: 1.6,
              maxWidth: 850,
            }}
          >
            Gérez les niveaux, modules et leçons du
            parcours pédagogique.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateLevel}
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
          NIVEAUX
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
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
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
                  alignItems: "center",
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
                  onClick={() =>
                    handleOpenEditLevel(level)
                  }
                  title="Modifier le niveau"
                  size="small"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() =>
                    handleDeleteLevel(level)
                  }
                  title="Supprimer le niveau"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* =================================================
                ACTION MODULE
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1.5,
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                }}
              >
                Modules
              </Typography>

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() =>
                  handleOpenCreateModule(level)
                }
                sx={{
                  borderRadius: 2,
                  alignSelf: {
                    xs: "stretch",
                    sm: "auto",
                  },
                }}
              >
                Ajouter un module
              </Button>
            </Box>

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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            wordBreak: "break-word",
                          }}
                        >
                          {module.order}. {module.title}
                        </Typography>

                        {module.is_required && (
                          <Chip
                            label="Obligatoire"
                            color="primary"
                            size="small"
                          />
                        )}
                      </Box>

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
                        alignItems: "center",
                        gap: 0.5,
                        flexWrap: "wrap",
                        flexShrink: 0,
                      }}
                    >
                      <Chip
                        icon={<MenuBookIcon />}
                        label={`${module.duration_minutes} min`}
                        size="small"
                      />

                      <IconButton
                        color="primary"
                        size="small"
                        title="Modifier le module"
                        onClick={() =>
                          handleOpenEditModule(module)
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        color="error"
                        size="small"
                        title="Supprimer le module"
                        onClick={() =>
                          handleDeleteModule(module)
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* =================================================
                      ACTION LEÇON
                  ================================================= */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: {
                        xs: "stretch",
                        sm: "center",
                      },
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                      }}
                    >
                      Leçons
                    </Typography>

                    <Button
                      variant="text"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        handleOpenCreateLesson(module)
                      }
                      sx={{
                        alignSelf: {
                          xs: "stretch",
                          sm: "auto",
                        },
                      }}
                    >
                      Ajouter une leçon
                    </Button>
                  </Box>

                  {/* =================================================
                      LEÇONS
                  ================================================= */}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {module.lessons?.map((lesson) => (
                      <Box
                        key={lesson.id}
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border:
                            "1px solid rgba(226,232,240,0.8)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: {
                              xs: "column",
                              sm: "row",
                            },
                            justifyContent:
                              "space-between",
                            gap: 1.5,
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
                                sx={{
                                  fontWeight: 600,
                                  wordBreak:
                                    "break-word",
                                }}
                              >
                                {lesson.order}.{" "}
                                {lesson.title}
                              </Typography>

                              {lesson.is_required && (
                                <Chip
                                  label="Obligatoire"
                                  color="primary"
                                  size="small"
                                />
                              )}
                            </Box>

                            {lesson.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                  lineHeight: 1.5,
                                  wordBreak:
                                    "break-word",
                                }}
                              >
                                {lesson.description}
                              </Typography>
                            )}

                            {lesson.objectives && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 0.75,
                                  lineHeight: 1.5,
                                  wordBreak:
                                    "break-word",
                                }}
                              >
                                <strong>
                                  Objectifs :
                                </strong>{" "}
                                {lesson.objectives}
                              </Typography>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              icon={<PlayLessonIcon />}
                              label={`${lesson.duration_minutes} min`}
                              size="small"
                            />

                            <IconButton
                              color="primary"
                              size="small"
                              title="Modifier la leçon"
                              onClick={() =>
                                handleOpenEditLesson(lesson)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              color="error"
                              size="small"
                              title="Supprimer la leçon"
                              onClick={() =>
                                handleDeleteLesson(lesson)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* COMPÉTENCES */}

                        {lesson.competencies?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              mt: 2,
                            }}
                          >
                            {lesson.competencies.map(
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
                                    gap: 1,
                                    px: 1.5,
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
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        wordBreak:
                                          "break-word",
                                      }}
                                    >
                                      {
                                        competency.title
                                      }
                                    </Typography>

                                    {competency.description && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {
                                          competency.description
                                        }
                                      </Typography>
                                    )}
                                  </Box>

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
                              )
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}

                    {(!module.lessons ||
                      module.lessons.length === 0) && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          py: 2,
                          textAlign: "center",
                        }}
                      >
                        Aucune leçon dans ce module.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}

              {(!level.modules ||
                level.modules.length === 0) && (
                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                    border: "1px dashed #cbd5e1",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Aucun module dans ce niveau.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* =========================================================
          DIALOG CRUD
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
        {/* =====================================================
            TITRE
        ===================================================== */}

        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
            },
          }}
        >
          {dialogType === "level" &&
            (editingLevel
              ? "Modifier le niveau"
              : "Ajouter un niveau")}

          {dialogType === "module" &&
            (editingModule
              ? "Modifier le module"
              : "Ajouter un module")}

          {dialogType === "lesson" &&
            (editingLesson
              ? "Modifier la leçon"
              : "Ajouter une leçon")}
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
            {/* =================================================
                FORMULAIRE NIVEAU
            ================================================= */}

            {dialogType === "level" && (
              <>
                <TextField
                  label="Numéro du niveau"
                  type="number"
                  value={levelNumber}
                  onChange={(event) =>
                    setLevelNumber(
                      event.target.value
                    )
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Nom du niveau"
                  value={levelName}
                  onChange={(event) =>
                    setLevelName(event.target.value)
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Description"
                  value={levelDescription}
                  onChange={(event) =>
                    setLevelDescription(
                      event.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={4}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={levelIsActive}
                      onChange={(event) =>
                        setLevelIsActive(
                          event.target.checked
                        )
                      }
                    />
                  }
                  label="Niveau actif"
                />
              </>
            )}

            {/* =================================================
                FORMULAIRE MODULE
            ================================================= */}

            {dialogType === "module" && (
              <>
                <TextField
                  label="Titre du module"
                  value={moduleTitle}
                  onChange={(event) =>
                    setModuleTitle(
                      event.target.value
                    )
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Description"
                  value={moduleDescription}
                  onChange={(event) =>
                    setModuleDescription(
                      event.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={3}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Ordre"
                    type="number"
                    value={moduleOrder}
                    onChange={(event) =>
                      setModuleOrder(
                        event.target.value
                      )
                    }
                    fullWidth
                    required
                  />

                  <TextField
                    label="Durée (minutes)"
                    type="number"
                    value={moduleDuration}
                    onChange={(event) =>
                      setModuleDuration(
                        event.target.value
                      )
                    }
                    fullWidth
                    required
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={moduleIsRequired}
                      onChange={(event) =>
                        setModuleIsRequired(
                          event.target.checked
                        )
                      }
                    />
                  }
                  label="Module obligatoire"
                />
              </>
            )}

            {/* =================================================
                FORMULAIRE LEÇON
            ================================================= */}

            {dialogType === "lesson" && (
              <>
                <TextField
                  label="Titre de la leçon"
                  value={lessonTitle}
                  onChange={(event) =>
                    setLessonTitle(
                      event.target.value
                    )
                  }
                  fullWidth
                  required
                />

                <TextField
                  label="Objectifs"
                  value={lessonObjectives}
                  onChange={(event) =>
                    setLessonObjectives(
                      event.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={3}
                />

                <TextField
                  label="Description"
                  value={lessonDescription}
                  onChange={(event) =>
                    setLessonDescription(
                      event.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={3}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Ordre"
                    type="number"
                    value={lessonOrder}
                    onChange={(event) =>
                      setLessonOrder(
                        event.target.value
                      )
                    }
                    fullWidth
                    required
                  />

                  <TextField
                    label="Durée (minutes)"
                    type="number"
                    value={lessonDuration}
                    onChange={(event) =>
                      setLessonDuration(
                        event.target.value
                      )
                    }
                    fullWidth
                    required
                  />
                </Box>

                <TextField
                  label="Contenu de la leçon"
                  value={lessonContent}
                  onChange={(event) =>
                    setLessonContent(
                      event.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Contenu pédagogique de la leçon..."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={lessonIsRequired}
                      onChange={(event) =>
                        setLessonIsRequired(
                          event.target.checked
                        )
                      }
                    />
                  }
                  label="Leçon obligatoire"
                />
              </>
            )}
          </Box>
        </DialogContent>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

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
              (dialogType === "level" &&
                (!levelNumber ||
                  !levelName.trim())) ||
              (dialogType === "module" &&
                (!moduleLevel ||
                  !moduleTitle.trim() ||
                  !moduleOrder)) ||
              (dialogType === "lesson" &&
                (!lessonModule ||
                  !lessonTitle.trim() ||
                  !lessonOrder))
            }
          >
            {saving
              ? "Enregistrement..."
              : dialogType === "level"
                ? editingLevel
                  ? "Modifier"
                  : "Créer"
                : dialogType === "module"
                  ? editingModule
                    ? "Modifier"
                    : "Créer"
                  : editingLesson
                    ? "Modifier"
                    : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Curriculum;