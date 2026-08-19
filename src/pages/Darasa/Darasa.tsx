import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";

import { useForm, Controller } from "react-hook-form";

import { useDarasa } from "../../hooks/useDarasa";
import { useStudents } from "../../hooks/useStudents";

import QuranSelector from "../../components/selector/QuranSelector";

import { useCurriculum } from "../../hooks/useCurriculum";
import type { SessionType } from "../../types";

interface CurriculumLesson {
  id: number;
  module: number;
  title: string;
  objectives?: string;
  description?: string;
  order: number;
  duration_minutes?: number;
  is_required?: boolean;
  content?: string;
}

interface CurriculumModule {
  id: number;
  level: number;
  title: string;
  description?: string;
  order: number;
  lessons: CurriculumLesson[];
}

interface CurriculumLevel {
  id: number;
  level_number: number;
  name: string;
  description?: string;
  modules: CurriculumModule[];
}

interface DarasaForm {
  student: string;
  session_type: SessionType;

  level: number;
  module: number;
  lesson: number;

  surah: number;
  verse_start: number;
  verse_end: number;

  date: string;
  start_time: string;
  end_time: string;

  notes: string;
}

const SESSION_TYPES = [
  { value: "QURAN", label: "Coran" },
  { value: "PRAYER", label: "Prière" },
  { value: "WUDU", label: "Ablution" },
  { value: "TAJWEED", label: "Tajwid" },
  { value: "HADITH", label: "Hadith" },
  { value: "FIQH", label: "Fiqh" },
  { value: "SIRAH", label: "Sira" },
  { value: "DUA", label: "Invocations" },
  { value: "ARABIC", label: "Arabe" },
];

function Darasa() {
  const {
    sessions,
    loading,
    error,
    page,
    setPage,
    total,
    pageSize,
    search,
    setSearch,
    addSession,
    reload,
  } = useDarasa();

  const { students } = useStudents("", 200);

  const {
    levels,
    loading: curriculumLoading,
    error: curriculumError,
  } = useCurriculum();

  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<DarasaForm>({
    defaultValues: {
      student: "",
      session_type: "QURAN",

      level: 0,
      module: 0,
      lesson: 0,

      surah: 0,
      verse_start: 1,
      verse_end: 1,

      date: new Date().toISOString().slice(0, 10),

      start_time: "08:00",
      end_time: "09:00",

      notes: "",
    },
  });

  const selectedLevelId = watch("level");
  const selectedModuleId = watch("module");
  const selectedLessonId = watch("lesson");
  const selectedSessionType = watch("session_type");

  const selectedLevel = useMemo(() => {
    return (levels as CurriculumLevel[] | undefined)?.find(
      (level) => level.id === Number(selectedLevelId)
    );
  }, [levels, selectedLevelId]);

  const modules = useMemo(() => {
    return selectedLevel?.modules ?? [];
  }, [selectedLevel]);

  const selectedModule = useMemo(() => {
    return modules.find(
      (module) => module.id === Number(selectedModuleId)
    );
  }, [modules, selectedModuleId]);

  const lessons = useMemo(() => {
    return selectedModule?.lessons ?? [];
  }, [selectedModule]);

  const selectedLesson = useMemo(() => {
    return lessons.find(
      (lesson) => lesson.id === Number(selectedLessonId)
    );
  }, [lessons, selectedLessonId]);

  const handleLevelChange = (levelId: number) => {
    setValue("level", levelId);
    setValue("module", 0);
    setValue("lesson", 0);
  };

  const handleModuleChange = (moduleId: number) => {
    setValue("module", moduleId);
    setValue("lesson", 0);
  };

  const handleSessionTypeChange = (type: SessionType) => {
    setValue("session_type", type);

    if (type !== "QURAN") {
      setValue("surah", 0);
      setValue("verse_start", 1);
      setValue("verse_end", 1);
    }
  };

  const onSubmit = async (values: DarasaForm) => {
    setFormError(null);

    try {
      if (!values.student) {
        setFormError("Veuillez sélectionner un apprenant.");
        return;
      }

      if (!values.level) {
        setFormError("Veuillez sélectionner un niveau du curriculum.");
        return;
      }

      if (!values.module) {
        setFormError("Veuillez sélectionner un module.");
        return;
      }

      if (!values.lesson) {
        setFormError("Veuillez sélectionner une leçon.");
        return;
      }

      if (values.session_type === "QURAN" && !values.surah) {
        setFormError("Veuillez sélectionner une sourate.");
        return;
      }

      await addSession({
        student: Number(values.student),

        session_type: values.session_type,

        lesson: Number(values.lesson),

        surah:
          values.session_type === "QURAN"
            ? Number(values.surah)
            : null,

        verse_start:
          values.session_type === "QURAN"
            ? Number(values.verse_start)
            : null,

        verse_end:
          values.session_type === "QURAN"
            ? Number(values.verse_end)
            : null,

        date: values.date,
        start_time: values.start_time,
        end_time: values.end_time || null,

        notes: values.notes,
      });

      await reload();

      reset({
        student: "",
        session_type: "QURAN",

        level: 0,
        module: 0,
        lesson: 0,

        surah: 0,
        verse_start: 1,
        verse_end: 1,

        date: new Date().toISOString().slice(0, 10),

        start_time: "08:00",
        end_time: "09:00",

        notes: "",
      });
    } catch (err: any) {
      setFormError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de l'enregistrement de la séance."
      );
    }
  };

  const tableRows = useMemo(() => {
    return sessions.map((session: any) => ({
      id: session.id,

      student: session.student_name ?? "—",

      type:
        SESSION_TYPES.find(
          (item) => item.value === session.session_type
        )?.label ??
        session.session_type ??
        "—",

      level: session.level_name ?? "—",

      lesson: session.lesson_title ?? "—",

      surah: session.surah_name ?? "—",

      teacher: session.teacher_name ?? "—",

      date: session.date ?? "—",

      verses:
        session.verse_start && session.verse_end
          ? `${session.verse_start}-${session.verse_end}`
          : "—",
    }));
  }, [sessions]);

  const sectionTitleSx = {
    fontWeight: 800,
    color: "text.primary",
    letterSpacing: "-0.01em",
  };

  const paperSx = {
    borderRadius: { xs: 2.5, sm: 3 },
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.75,
              }}
            >
              <Box
                sx={{
                  width: { xs: 42, sm: 48 },
                  height: { xs: 42, sm: 48 },
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow:
                    "0 8px 20px rgba(25, 118, 210, 0.2)",
                  flexShrink: 0,
                }}
              >
                <MenuBookIcon />
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    ...sectionTitleSx,
                    fontSize: {
                      xs: "1.45rem",
                      sm: "1.75rem",
                      md: "2rem",
                    },
                  }}
                >
                  Séances de Dars
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.25,
                    maxWidth: 700,
                    lineHeight: 1.6,
                  }}
                >
                  Séance de Dars
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(360px, 0.85fr) minmax(0, 1.5fr)",
          },
          alignItems: "start",
        }}
      >
        {/* FORMULAIRE */}
        <Paper sx={paperSx}>
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
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
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.50",
                  color: "primary.main",
                }}
              >
                <SaveIcon fontSize="small" />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    ...sectionTitleSx,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  Nouvelle séance
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Remplissez les informations de la séance
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 2, sm: 3 },
            }}
          >
            {formError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  alignItems: "center",
                }}
              >
                {formError}
              </Alert>
            )}

            {curriculumError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  alignItems: "center",
                }}
              >
                {curriculumError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "grid",
                gap: { xs: 1.75, sm: 2 },
              }}
            >
              {/* APPRENANT */}
              <Controller
                name="student"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Apprenant</InputLabel>

                    <Select
                      {...field}
                      label="Apprenant"
                      value={field.value || ""}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">
                        Sélectionner un apprenant
                      </MenuItem>

                      {students.map((student: any) => (
                        <MenuItem
                          key={student.id}
                          value={student.id}
                        >
                          {student.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {/* TYPE DE SÉANCE */}
              <Controller
                name="session_type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Type de séance</InputLabel>

                    <Select
                      {...field}
                      label="Type de séance"
                      value={field.value}
                      onChange={(event) => {
                        handleSessionTypeChange(
                          event.target.value as SessionType
                        );
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      {SESSION_TYPES.map((type) => (
                        <MenuItem
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Divider sx={{ my: 0.5 }} />

              {/* CURRICULUM HEADER */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 1.75,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "background.paper",
                      color: "primary.main",
                    }}
                  >
                    <MenuBookIcon fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800 }}
                    >
                      Curriculum
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Niveau, module et leçon
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* NIVEAU */}
              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>

                <Select
                  value={selectedLevelId || ""}
                  label="Niveau"
                  disabled={curriculumLoading}
                  onChange={(event) => {
                    handleLevelChange(
                      Number(event.target.value)
                    );
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    Sélectionner un niveau
                  </MenuItem>

                  {(levels as CurriculumLevel[] | undefined)?.map(
                    (level) => (
                      <MenuItem
                        key={level.id}
                        value={level.id}
                      >
                        Niveau {level.level_number} — {level.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* MODULE */}
              <FormControl
                fullWidth
                disabled={!selectedLevelId}
              >
                <InputLabel>Module</InputLabel>

                <Select
                  value={selectedModuleId || ""}
                  label="Module"
                  onChange={(event) => {
                    handleModuleChange(
                      Number(event.target.value)
                    );
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    Sélectionner un module
                  </MenuItem>

                  {modules.map((module) => (
                    <MenuItem
                      key={module.id}
                      value={module.id}
                    >
                      {module.order}. {module.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* LEÇON */}
              <FormControl
                fullWidth
                disabled={!selectedModuleId}
              >
                <InputLabel>Leçon</InputLabel>

                <Select
                  value={selectedLessonId || ""}
                  label="Leçon"
                  onChange={(event) => {
                    setValue(
                      "lesson",
                      Number(event.target.value)
                    );
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    Sélectionner une leçon
                  </MenuItem>

                  {lessons.map((lesson) => (
                    <MenuItem
                      key={lesson.id}
                      value={lesson.id}
                    >
                      {lesson.order}. {lesson.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* INFORMATIONS LEÇON */}
              {selectedLesson && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 1.75, sm: 2 },
                    borderRadius: 2.5,
                    bgcolor: "primary.50",
                    borderColor: "primary.100",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: "text.primary",
                    }}
                  >
                    {selectedLesson.title}
                  </Typography>

                  {selectedLesson.objectives && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>Objectifs :</strong>{" "}
                      {selectedLesson.objectives}
                    </Typography>
                  )}

                  {selectedLesson.duration_minutes && (
                    <Chip
                      size="small"
                      icon={<AccessTimeIcon />}
                      label={`${selectedLesson.duration_minutes} min`}
                      sx={{
                        mt: 1.5,
                        borderRadius: 1.5,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Paper>
              )}

              {/* CORAN */}
              {selectedSessionType === "QURAN" && (
                <>
                  <Divider sx={{ my: 0.5 }} />

                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1.75,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "background.paper",
                          color: "primary.main",
                        }}
                      >
                        <MenuBookIcon fontSize="small" />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800 }}
                        >
                          Contenu coranique
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Sourate et passages étudiés
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <QuranSelector
                    verseStart={watch("verse_start")}
                    verseEnd={watch("verse_end")}
                    setVerseStart={(value) =>
                      setValue(
                        "verse_start",
                        value
                      )
                    }
                    setVerseEnd={(value) =>
                      setValue(
                        "verse_end",
                        value
                      )
                    }
                    setSurah={(value) =>
                      setValue(
                        "surah",
                        value
                      )
                    }
                  />
                </>
              )}

              {/* DATE / HEURES */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                <TextField
                  type="date"
                  label="Date"
                  fullWidth
                  {...control.register("date")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  type="time"
                  label="Début"
                  fullWidth
                  {...control.register("start_time")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  type="time"
                  label="Fin"
                  fullWidth
                  {...control.register("end_time")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* OBSERVATION */}
              <TextField
                label="Observation"
                multiline
                rows={4}
                fullWidth
                placeholder="Ajouter une observation concernant la séance..."
                {...control.register("notes")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={
                  isSubmitting ||
                  curriculumLoading
                }
                size="large"
                startIcon={
                  isSubmitting ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  minHeight: 50,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow:
                    "0 6px 16px rgba(25, 118, 210, 0.2)",
                  "&:hover": {
                    boxShadow:
                      "0 8px 20px rgba(25, 118, 210, 0.28)",
                  },
                }}
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : "Enregistrer la séance"}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* HISTORIQUE */}
        <Paper sx={paperSx}>
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
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
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    color: "primary.main",
                  }}
                >
                  <PeopleAltIcon fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      ...sectionTitleSx,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                    }}
                  >
                    Historique
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Séances enregistrées
                  </Typography>
                </Box>
              </Box>

              <TextField
                placeholder="Rechercher..."
                size="small"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                fullWidth
                sx={{
                  maxWidth: { sm: 280 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          color: "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={34} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Chargement des séances...
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                }}
              >
                <Table
                  size="small"
                  sx={{
                    minWidth: 1000,
                    "& .MuiTableCell-root": {
                      borderColor: "divider",
                    },
                    "& .MuiTableHead-root .MuiTableCell-root": {
                      bgcolor: "grey.50",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    },
                    "& .MuiTableBody-root .MuiTableRow-root:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Apprenant</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Niveau</TableCell>
                      <TableCell>Leçon</TableCell>
                      <TableCell>Sourate</TableCell>
                      <TableCell>Versets</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Enseignant</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tableRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          align="center"
                          sx={{
                            py: 7,
                            color: "text.secondary",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <MenuBookIcon
                              sx={{
                                fontSize: 42,
                                color: "text.disabled",
                              }}
                            />

                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              Aucune séance enregistrée
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Les séances enregistrées apparaîtront ici.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableRows.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.student}
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={row.type}
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>

                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {row.level}
                          </TableCell>

                          <TableCell
                            sx={{
                              maxWidth: 220,
                              minWidth: 180,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {row.lesson}
                            </Typography>
                          </TableCell>

                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {row.surah}
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              variant="outlined"
                              label={row.verses}
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>

                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {row.date}
                          </TableCell>

                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.teacher}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            )}

            {total !== null && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2.5,
                  overflowX: "auto",
                }}
              >
                <Pagination
                  count={Math.max(
                    1,
                    Math.ceil(total / pageSize)
                  )}
                  page={page}
                  onChange={(_, value) =>
                    setPage(value)
                  }
                  color="primary"
                  shape="rounded"
                  size="medium"
                  siblingCount={0}
                  boundaryCount={1}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Darasa;