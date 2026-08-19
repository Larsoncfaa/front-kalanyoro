import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useCurriculum } from "../../hooks/useCurriculum";

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

import type {
  CurriculumLevel,
  CurriculumModule,
  CurriculumLesson,
} from "../../api/curriculum.api";

function Curriculum() {
  const { levels, loading, error, reload } = useCurriculum();

  // =========================================================
  // DIALOG NIVEAU
  // =========================================================

  const [openLevelDialog, setOpenLevelDialog] = useState(false);
  const [editingLevel, setEditingLevel] =
    useState<CurriculumLevel | null>(null);

  const [levelNumber, setLevelNumber] = useState("");
  const [levelName, setLevelName] = useState("");
  const [levelDescription, setLevelDescription] = useState("");
  const [levelActive, setLevelActive] = useState(true);

  // =========================================================
  // DIALOG MODULE
  // =========================================================

  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [editingModule, setEditingModule] =
    useState<CurriculumModule | null>(null);

  const [moduleLevelId, setModuleLevelId] = useState<number | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleOrder, setModuleOrder] = useState("1");
  const [moduleDuration, setModuleDuration] = useState("20");
  const [moduleRequired, setModuleRequired] = useState(true);

  // =========================================================
  // DIALOG LEÇON
  // =========================================================

  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] =
    useState<CurriculumLesson | null>(null);

  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonObjectives, setLessonObjectives] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonOrder, setLessonOrder] = useState("1");
  const [lessonDuration, setLessonDuration] = useState("10");
  const [lessonRequired, setLessonRequired] = useState(true);
  const [lessonContent, setLessonContent] = useState("");

  // =========================================================
  // ETAT GLOBAL
  // =========================================================

  const [saving, setSaving] = useState(false);

  const [expandedLevels, setExpandedLevels] = useState<
    Record<number, boolean>
  >({});

  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});

  // =========================================================
  // UTILITAIRE
  // =========================================================

  const resetLevelForm = () => {
    setEditingLevel(null);
    setLevelNumber("");
    setLevelName("");
    setLevelDescription("");
    setLevelActive(true);
  };

  const resetModuleForm = () => {
    setEditingModule(null);
    setModuleLevelId(null);
    setModuleTitle("");
    setModuleDescription("");
    setModuleOrder("1");
    setModuleDuration("20");
    setModuleRequired(true);
  };

  const resetLessonForm = () => {
    setEditingLesson(null);
    setLessonModuleId(null);
    setLessonTitle("");
    setLessonObjectives("");
    setLessonDescription("");
    setLessonOrder("1");
    setLessonDuration("10");
    setLessonRequired(true);
    setLessonContent("");
  };

  // =========================================================
  // EXPANSION
  // =========================================================

  const toggleLevel = (levelId: number) => {
    setExpandedLevels((previous) => ({
      ...previous,
      [levelId]: !(previous[levelId] ?? true),
    }));
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((previous) => ({
      ...previous,
      [moduleId]: !(previous[moduleId] ?? true),
    }));
  };

  // =========================================================
  // NIVEAU — CRÉER
  // =========================================================

  const handleOpenCreateLevel = () => {
    resetLevelForm();
    setOpenLevelDialog(true);
  };

  // =========================================================
  // NIVEAU — MODIFIER
  // =========================================================

  const handleOpenEditLevel = (level: CurriculumLevel) => {
    setEditingLevel(level);

    setLevelNumber(String(level.level_number));
    setLevelName(level.name);
    setLevelDescription(level.description || "");
    setLevelActive(level.is_active);

    setOpenLevelDialog(true);
  };

  // =========================================================
  // NIVEAU — SAUVEGARDER
  // =========================================================

  const handleSaveLevel = async () => {
    if (!levelNumber || !levelName.trim()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        level_number: Number(levelNumber),
        name: levelName.trim(),
        description: levelDescription.trim(),
        is_active: levelActive,
      };

      if (editingLevel) {
        await updateCurriculumLevel(editingLevel.id, payload);
      } else {
        await createCurriculumLevel(payload);
      }

      setOpenLevelDialog(false);

      await reload();
    } catch (err) {
      console.error("Erreur niveau :", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // NIVEAU — SUPPRIMER
  // =========================================================

  const handleDeleteLevel = async (level: CurriculumLevel) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le niveau "${level.name}" ?\n\nTous ses modules et ses leçons seront également supprimés.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteCurriculumLevel(level.id);

      await reload();
    } catch (err) {
      console.error("Erreur suppression niveau :", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // MODULE — CRÉER
  // =========================================================

  const handleOpenCreateModule = (level: CurriculumLevel) => {
    resetModuleForm();

    setModuleLevelId(level.id);

    const nextOrder = (level.modules?.length || 0) + 1;
    setModuleOrder(String(nextOrder));

    setOpenModuleDialog(true);
  };

  // =========================================================
  // MODULE — MODIFIER
  // =========================================================

  const handleOpenEditModule = (module: CurriculumModule) => {
    setEditingModule(module);

    setModuleLevelId(module.level);
    setModuleTitle(module.title);
    setModuleDescription(module.description || "");
    setModuleOrder(String(module.order));
    setModuleDuration(String(module.duration_minutes));
    setModuleRequired(module.is_required);

    setOpenModuleDialog(true);
  };

  // =========================================================
  // MODULE — SAUVEGARDER
  // =========================================================

  const handleSaveModule = async () => {
    if (
      !moduleLevelId ||
      !moduleTitle.trim() ||
      !moduleOrder ||
      !moduleDuration
    ) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        level: moduleLevelId,
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
        order: Number(moduleOrder),
        duration_minutes: Number(moduleDuration),
        is_required: moduleRequired,
      };

      if (editingModule) {
        await updateCurriculumModule(editingModule.id, payload);
      } else {
        await createCurriculumModule(payload);
      }

      setOpenModuleDialog(false);

      await reload();
    } catch (err) {
      console.error("Erreur module :", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // MODULE — SUPPRIMER
  // =========================================================

  const handleDeleteModule = async (module: CurriculumModule) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le module "${module.title}" ?\n\nToutes les leçons de ce module seront également supprimées.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteCurriculumModule(module.id);

      await reload();
    } catch (err) {
      console.error("Erreur suppression module :", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LEÇON — CRÉER
  // =========================================================

  const handleOpenCreateLesson = (module: CurriculumModule) => {
    resetLessonForm();

    setLessonModuleId(module.id);

    const nextOrder = (module.lessons?.length || 0) + 1;
    setLessonOrder(String(nextOrder));

    setOpenLessonDialog(true);
  };

  // =========================================================
  // LEÇON — MODIFIER
  // =========================================================

  const handleOpenEditLesson = (lesson: CurriculumLesson) => {
    setEditingLesson(lesson);

    setLessonModuleId(lesson.module);
    setLessonTitle(lesson.title);
    setLessonObjectives(lesson.objectives || "");
    setLessonDescription(lesson.description || "");
    setLessonOrder(String(lesson.order));
    setLessonDuration(String(lesson.duration_minutes));
    setLessonRequired(lesson.is_required);
    setLessonContent(lesson.content || "");

    setOpenLessonDialog(true);
  };

  // =========================================================
  // LEÇON — SAUVEGARDER
  // =========================================================

  const handleSaveLesson = async () => {
    if (
      !lessonModuleId ||
      !lessonTitle.trim() ||
      !lessonOrder ||
      !lessonDuration
    ) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        module: lessonModuleId,
        title: lessonTitle.trim(),
        objectives: lessonObjectives.trim(),
        description: lessonDescription.trim(),
        order: Number(lessonOrder),
        duration_minutes: Number(lessonDuration),
        is_required: lessonRequired,
        content: lessonContent.trim(),
      };

      if (editingLesson) {
        await updateCurriculumLesson(editingLesson.id, payload);
      } else {
        await createCurriculumLesson(payload);
      }

      setOpenLessonDialog(false);

      await reload();
    } catch (err) {
      console.error("Erreur leçon :", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LEÇON — SUPPRIMER
  // =========================================================

  const handleDeleteLesson = async (lesson: CurriculumLesson) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la leçon "${lesson.title}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteCurriculumLesson(lesson.id);

      await reload();
    } catch (err) {
      console.error("Erreur suppression leçon :", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // FERMETURE DIALOGS
  // =========================================================

  const handleCloseLevelDialog = () => {
    if (saving) return;
    setOpenLevelDialog(false);
  };

  const handleCloseModuleDialog = () => {
    if (saving) return;
    setOpenModuleDialog(false);
  };

  const handleCloseLessonDialog = () => {
    if (saving) return;
    setOpenLessonDialog(false);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 350,
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
  // ERROR
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
          mb: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "1.55rem",
                sm: "1.9rem",
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
                xs: "0.88rem",
                sm: "0.95rem",
              },
              lineHeight: 1.6,
              maxWidth: 850,
            }}
          >
            Organisez les niveaux, les modules et les leçons du
            parcours pédagogique.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateLevel}
          sx={{
            minHeight: 44,
            borderRadius: 2.5,
            px: 2.5,
            alignSelf: {
              xs: "stretch",
              md: "center",
            },
            whiteSpace: "nowrap",
          }}
        >
          Ajouter un niveau
        </Button>
      </Box>

      {/* =====================================================
          LISTE DES NIVEAUX
      ===================================================== */}

      {levels.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 50,
              color: "text.secondary",
              mb: 1,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Aucun niveau
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Commencez par créer le premier niveau du curriculum.
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateLevel}
            sx={{
              mt: 3,
              borderRadius: 2.5,
            }}
          >
            Créer le premier niveau
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, md: 3 },
          }}
        >
          {levels.map((level) => {
            const levelExpanded =
              expandedLevels[level.id] ?? true;

            return (
              <Paper
                key={level.id}
                elevation={0}
                sx={{
                  p: {
                    xs: 1.5,
                    sm: 2.5,
                    md: 3,
                  },
                  borderRadius: {
                    xs: 3,
                    md: 4,
                  },
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
                      <Chip
                        icon={<SchoolIcon />}
                        label={`Niveau ${level.level_number}`}
                        color="success"
                        size="small"
                      />

                      {!level.is_active && (
                        <Chip
                          label="Inactif"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        fontWeight: 800,
                        fontSize: {
                          xs: "1.05rem",
                          sm: "1.25rem",
                        },
                        wordBreak: "break-word",
                      }}
                    >
                      {level.name}
                    </Typography>

                    {level.description && (
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
                    )}
                  </Box>

                  {/* ACTIONS NIVEAU */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: {
                        xs: "flex-start",
                        sm: "flex-end",
                      },
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        handleOpenCreateModule(level)
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Module
                    </Button>

                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleOpenEditLevel(level)
                      }
                      title="Modifier le niveau"
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteLevel(level)
                      }
                      title="Supprimer le niveau"
                    >
                      <DeleteIcon />
                    </IconButton>

                    <IconButton
                      onClick={() =>
                        toggleLevel(level.id)
                      }
                      title={
                        levelExpanded
                          ? "Réduire"
                          : "Afficher"
                      }
                    >
                      {levelExpanded ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* =================================================
                    CONTENU NIVEAU
                ================================================= */}

                {levelExpanded && (
                  <>
                    <Divider sx={{ my: { xs: 2, sm: 2.5 } }} />

                    {level.modules?.length === 0 ? (
                      <Box
                        sx={{
                          py: 3,
                          textAlign: "center",
                          bgcolor: "#f8fafc",
                          borderRadius: 3,
                        }}
                      >
                        <MenuBookIcon
                          sx={{
                            fontSize: 35,
                            color: "text.secondary",
                          }}
                        />

                        <Typography
                          sx={{
                            mt: 1,
                            fontWeight: 600,
                          }}
                        >
                          Aucun module
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Ajoutez le premier module à ce
                          niveau.
                        </Typography>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() =>
                            handleOpenCreateModule(level)
                          }
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                          }}
                        >
                          Ajouter un module
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {level.modules?.map((module) => {
                          const moduleExpanded =
                            expandedModules[module.id] ??
                            true;

                          return (
                            <Paper
                              key={module.id}
                              variant="outlined"
                              sx={{
                                p: {
                                  xs: 1.5,
                                  sm: 2,
                                  md: 2.5,
                                },
                                borderRadius: 3,
                                bgcolor: "#ffffff",
                              }}
                            >
                              {/* =================================
                                  MODULE HEADER
                              ================================= */}

                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: {
                                    xs: "column",
                                    md: "row",
                                  },
                                  justifyContent:
                                    "space-between",
                                  alignItems: {
                                    xs: "stretch",
                                    md: "center",
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
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems:
                                        "center",
                                      flexWrap: "wrap",
                                      gap: 1,
                                    }}
                                  >
                                    <Chip
                                      icon={
                                        <MenuBookIcon />
                                      }
                                      label={`Module ${module.order}`}
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

                                  <Typography
                                    sx={{
                                      mt: 1,
                                      fontWeight: 800,
                                      wordBreak:
                                        "break-word",
                                    }}
                                  >
                                    {module.title}
                                  </Typography>

                                  {module.description && (
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
                                      {
                                        module.description
                                      }
                                    </Typography>
                                  )}
                                </Box>

                                {/* MODULE ACTIONS */}

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems:
                                      "center",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  <Chip
                                    label={`${module.duration_minutes} min`}
                                    size="small"
                                  />

                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={
                                      <AddIcon />
                                    }
                                    onClick={() =>
                                      handleOpenCreateLesson(
                                        module
                                      )
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      textTransform:
                                        "none",
                                    }}
                                  >
                                    Leçon
                                  </Button>

                                  <IconButton
                                    color="primary"
                                    size="small"
                                    title="Modifier le module"
                                    onClick={() =>
                                      handleOpenEditModule(
                                        module
                                      )
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>

                                  <IconButton
                                    color="error"
                                    size="small"
                                    title="Supprimer le module"
                                    onClick={() =>
                                      handleDeleteModule(
                                        module
                                      )
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>

                                  <IconButton
                                    size="small"
                                    title={
                                      moduleExpanded
                                        ? "Réduire"
                                        : "Afficher"
                                    }
                                    onClick={() =>
                                      toggleModule(
                                        module.id
                                      )
                                    }
                                  >
                                    {moduleExpanded ? (
                                      <ExpandLessIcon />
                                    ) : (
                                      <ExpandMoreIcon />
                                    )}
                                  </IconButton>
                                </Box>
                              </Box>

                              {/* =================================
                                  LEÇONS
                              ================================= */}

                              {moduleExpanded && (
                                <Box
                                  sx={{
                                    mt: 2,
                                  }}
                                >
                                  {module.lessons
                                    ?.length === 0 ? (
                                    <Box
                                      sx={{
                                        p: 2,
                                        borderRadius: 2.5,
                                        bgcolor:
                                          "#f8fafc",
                                        textAlign:
                                          "center",
                                      }}
                                    >
                                      <PlayLessonIcon
                                        sx={{
                                          color:
                                            "text.secondary",
                                        }}
                                      />

                                      <Typography
                                        variant="body2"
                                        sx={{
                                          mt: 0.5,
                                          fontWeight: 600,
                                        }}
                                      >
                                        Aucune leçon
                                      </Typography>

                                      <Button
                                        size="small"
                                        startIcon={
                                          <AddIcon />
                                        }
                                        onClick={() =>
                                          handleOpenCreateLesson(
                                            module
                                          )
                                        }
                                        sx={{
                                          mt: 1,
                                        }}
                                      >
                                        Ajouter une
                                        leçon
                                      </Button>
                                    </Box>
                                  ) : (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection:
                                          "column",
                                        gap: 1,
                                      }}
                                    >
                                      {module.lessons?.map(
                                        (lesson) => (
                                          <Box
                                            key={
                                              lesson.id
                                            }
                                            sx={{
                                              p: {
                                                xs: 1.25,
                                                sm: 1.75,
                                              },
                                              borderRadius: 2.5,
                                              bgcolor:
                                                "#f8fafc",
                                              border:
                                                "1px solid rgba(226,232,240,0.8)",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display:
                                                  "flex",
                                                flexDirection:
                                                  {
                                                    xs: "column",
                                                    sm: "row",
                                                  },
                                                justifyContent:
                                                  "space-between",
                                                alignItems:
                                                  {
                                                    xs: "stretch",
                                                    sm: "center",
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
                                                <Box
                                                  sx={{
                                                    display:
                                                      "flex",
                                                    alignItems:
                                                      "center",
                                                    flexWrap:
                                                      "wrap",
                                                    gap: 1,
                                                  }}
                                                >
                                                  <Chip
                                                    label={`Leçon ${lesson.order}`}
                                                    size="small"
                                                    variant="outlined"
                                                  />

                                                  {lesson.is_required && (
                                                    <Chip
                                                      label="Obligatoire"
                                                      size="small"
                                                      color="primary"
                                                    />
                                                  )}
                                                </Box>

                                                <Typography
                                                  sx={{
                                                    mt: 0.75,
                                                    fontWeight: 700,
                                                    wordBreak:
                                                      "break-word",
                                                  }}
                                                >
                                                  {
                                                    lesson.title
                                                  }
                                                </Typography>

                                                {lesson.description && (
                                                  <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                      mt: 0.5,
                                                      lineHeight:
                                                        1.5,
                                                      wordBreak:
                                                        "break-word",
                                                    }}
                                                  >
                                                    {
                                                      lesson.description
                                                    }
                                                  </Typography>
                                                )}
                                              </Box>

                                              {/* LEÇON ACTIONS */}

                                              <Box
                                                sx={{
                                                  display:
                                                    "flex",
                                                  alignItems:
                                                    "center",
                                                  flexWrap:
                                                    "wrap",
                                                  gap: 0.5,
                                                  flexShrink: 0,
                                                }}
                                              >
                                                <Chip
                                                  icon={
                                                    <PlayLessonIcon />
                                                  }
                                                  label={`${lesson.duration_minutes} min`}
                                                  size="small"
                                                />

                                                <IconButton
                                                  color="primary"
                                                  size="small"
                                                  title="Modifier la leçon"
                                                  onClick={() =>
                                                    handleOpenEditLesson(
                                                      lesson
                                                    )
                                                  }
                                                >
                                                  <EditIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                  color="error"
                                                  size="small"
                                                  title="Supprimer la leçon"
                                                  onClick={() =>
                                                    handleDeleteLesson(
                                                      lesson
                                                    )
                                                  }
                                                >
                                                  <DeleteIcon fontSize="small" />
                                                </IconButton>
                                              </Box>
                                            </Box>

                                            {/* OBJECTIFS */}

                                            {lesson.objectives && (
                                              <Box
                                                sx={{
                                                  mt: 1.5,
                                                  p: 1.25,
                                                  borderRadius: 2,
                                                  bgcolor:
                                                    "#ffffff",
                                                }}
                                              >
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    fontWeight: 700,
                                                    display:
                                                      "block",
                                                    mb: 0.25,
                                                  }}
                                                >
                                                  Objectifs
                                                </Typography>

                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                  sx={{
                                                    whiteSpace:
                                                      "pre-line",
                                                  }}
                                                >
                                                  {
                                                    lesson.objectives
                                                  }
                                                </Typography>
                                              </Box>
                                            )}

                                            {/* COMPETENCES */}

                                            {lesson
                                              .competencies
                                              ?.length >
                                              0 && (
                                              <Box
                                                sx={{
                                                  mt: 1.5,
                                                  display:
                                                    "flex",
                                                  flexDirection:
                                                    "column",
                                                  gap: 0.75,
                                                }}
                                              >
                                                {lesson.competencies.map(
                                                  (
                                                    competency
                                                  ) => (
                                                    <Box
                                                      key={
                                                        competency.id
                                                      }
                                                      sx={{
                                                        display:
                                                          "flex",
                                                        flexDirection:
                                                          {
                                                            xs: "column",
                                                            sm: "row",
                                                          },
                                                        justifyContent:
                                                          "space-between",
                                                        alignItems:
                                                          {
                                                            xs: "stretch",
                                                            sm: "center",
                                                          },
                                                        gap: 1,
                                                        px: 1.25,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        bgcolor:
                                                          competency.is_gate
                                                            ? "#fef3c7"
                                                            : "#ffffff",
                                                        border:
                                                          "1px solid rgba(226,232,240,0.8)",
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

                                                      <Box
                                                        sx={{
                                                          display:
                                                            "flex",
                                                          alignItems:
                                                            "center",
                                                          gap: 0.75,
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
                                            )}
                                          </Box>
                                        )
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              )}
                            </Paper>
                          );
                        })}
                      </Box>
                    )}
                  </>
                )}
              </Paper>
            );
          })}
        </Box>
      )}

      {/* =========================================================
          DIALOG NIVEAU
      ========================================================= */}

      <Dialog
        open={openLevelDialog}
        onClose={handleCloseLevelDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: {
                xs: 2.5,
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
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
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
              gap: 2.5,
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
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
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
                setLevelDescription(event.target.value)
              }
              fullWidth
              multiline
              rows={4}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={levelActive}
                  onChange={(event) =>
                    setLevelActive(
                      event.target.checked
                    )
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
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseLevelDialog}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveLevel}
            disabled={
              saving ||
              !levelNumber ||
              !levelName.trim()
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

      {/* =========================================================
          DIALOG MODULE
      ========================================================= */}

      <Dialog
        open={openModuleDialog}
        onClose={handleCloseModuleDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: {
                xs: 2.5,
                sm: 4,
              },
              mx: {
                xs: 1,
                sm: 2,
              },
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          {editingModule
            ? "Modifier le module"
            : "Ajouter un module"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              pt: 1,
            }}
          >
            <TextField
              label="Titre du module"
              value={moduleTitle}
              onChange={(event) =>
                setModuleTitle(event.target.value)
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
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
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
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={moduleRequired}
                  onChange={(event) =>
                    setModuleRequired(
                      event.target.checked
                    )
                  }
                />
              }
              label="Module obligatoire"
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseModuleDialog}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveModule}
            disabled={
              saving ||
              !moduleLevelId ||
              !moduleTitle.trim() ||
              !moduleOrder ||
              !moduleDuration
            }
          >
            {saving
              ? "Enregistrement..."
              : editingModule
                ? "Modifier"
                : "Créer le module"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
          DIALOG LEÇON
      ========================================================= */}

      <Dialog
        open={openLessonDialog}
        onClose={handleCloseLessonDialog}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: {
                xs: 2.5,
                sm: 4,
              },
              mx: {
                xs: 1,
                sm: 2,
              },
              maxHeight: {
                xs: "calc(100% - 32px)",
                sm: "calc(100% - 64px)",
              },
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          {editingLesson
            ? "Modifier la leçon"
            : "Ajouter une leçon"}
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
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
              label="Objectifs pédagogiques"
              value={lessonObjectives}
              onChange={(event) =>
                setLessonObjectives(
                  event.target.value
                )
              }
              fullWidth
              multiline
              rows={3}
              placeholder="Que doit maîtriser l'étudiant à la fin de cette leçon ?"
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
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
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
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
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
                  checked={lessonRequired}
                  onChange={(event) =>
                    setLessonRequired(
                      event.target.checked
                    )
                  }
                />
              }
              label="Leçon obligatoire"
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={handleCloseLessonDialog}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveLesson}
            disabled={
              saving ||
              !lessonModuleId ||
              !lessonTitle.trim() ||
              !lessonOrder ||
              !lessonDuration
            }
          >
            {saving
              ? "Enregistrement..."
              : editingLesson
                ? "Modifier la leçon"
                : "Créer la leçon"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Curriculum;