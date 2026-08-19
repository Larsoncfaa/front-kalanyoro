import { useCallback, useMemo, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";

import { useStudents } from "../../hooks/useStudents";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import type { Student } from "../../api/students.api";

const initialForm = {
  full_name: "",
  phone: "",
  address: "",
  birth_date: "",
};

function Students() {
  const { user } = useCurrentUser();

  const isAdmin = user?.role === "ADMIN";

  const {
    students,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    addStudent,
    editStudent,
    removeStudent,
  } = useStudents();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [formValues, setFormValues] =
    useState(initialForm);

  const [selectedStudentId, setSelectedStudentId] =
    useState<number | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  // ==========================================
  // NOUVEL ÉTUDIANT
  // ==========================================

  const openNewStudentDialog = () => {
    setFormValues(initialForm);
    setSelectedStudentId(null);
    setIsEditMode(false);
    setFormError(null);
    setDialogOpen(true);
  };

  // ==========================================
  // MODIFIER ÉTUDIANT
  // ==========================================

  const openEditStudentDialog = (
    student: Student
  ) => {
    setFormValues({
      full_name: student.full_name,
      phone: student.phone || "",
      address: student.address || "",
      birth_date: student.birth_date || "",
    });

    setSelectedStudentId(student.id);
    setIsEditMode(true);
    setFormError(null);
    setDialogOpen(true);
  };

  // ==========================================
  // FERMER DIALOG
  // ==========================================

  const closeDialog = () => {
    setDialogOpen(false);
    setFormError(null);
  };

  // ==========================================
  // CHANGEMENT FORMULAIRE
  // ==========================================

  const handleFieldChange = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError(null);
  };

  // ==========================================
  // ENREGISTRER
  // ==========================================

  const handleSubmit = async () => {
    setFormError(null);

    if (!formValues.full_name.trim()) {
      setFormError(
        "Le nom complet est requis."
      );
      return;
    }

    const payload = {
      full_name: formValues.full_name.trim(),
      phone: formValues.phone.trim(),
      address: formValues.address.trim(),
      birth_date:
        formValues.birth_date || null,
    };

    try {
      if (
        isEditMode &&
        selectedStudentId !== null
      ) {
        await editStudent(
          selectedStudentId,
          payload
        );
      } else {
        await addStudent(payload);
      }

      closeDialog();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Impossible de sauvegarder l'étudiant."
      );
    }
  };

  // ==========================================
  // SUPPRIMER
  // ==========================================

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = window.confirm(
        "Supprimer cet étudiant ? Cette action est irréversible."
      );

      if (!confirmed) return;

      try {
        await removeStudent(id);
      } catch {
        // Erreur gérée par le hook
      }
    },
    [removeStudent]
  );

  // ==========================================
  // LIGNES TABLEAU
  // ==========================================

  const tableRows = useMemo(
    () =>
      students.map((student) => (
        <TableRow
          key={student.id}
          hover
          sx={{
            "&:last-child td": {
              borderBottom: 0,
            },
          }}
        >
          {/* MATRICULE */}

          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                }}
              >
                <BadgeIcon fontSize="small" />
              </Avatar>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {student.matricule}
              </Typography>
            </Box>
          </TableCell>

          {/* NOM */}

          <TableCell>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                minWidth: 180,
              }}
            >
              {student.full_name}
            </Typography>
          </TableCell>

          {/* TELEPHONE */}

          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                whiteSpace: "nowrap",
              }}
            >
              <PhoneIcon
                sx={{
                  fontSize: 18,
                  color: "#64748b",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {student.phone ||
                  "Non renseigné"}
              </Typography>
            </Box>
          </TableCell>

          {/* AGE */}

          <TableCell>
            <Chip
              size="small"
              label={
                student.age !== null &&
                student.age !== undefined
                  ? `${student.age} ans`
                  : "—"
              }
              sx={{
                fontWeight: 600,
                bgcolor: "#f1f5f9",
                color: "#475569",
              }}
            />
          </TableCell>

          {/* ACTIONS */}

          {isAdmin && (
            <TableCell align="right">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    openEditStudentDialog(
                      student
                    )
                  }
                  title="Modifier"
                  sx={{
                    color: "#0f766e",
                    bgcolor: "#ecfdf5",

                    "&:hover": {
                      bgcolor: "#d1fae5",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    void handleDelete(
                      student.id
                    )
                  }
                  title="Supprimer"
                  sx={{
                    bgcolor: "#fef2f2",

                    "&:hover": {
                      bgcolor: "#fee2e2",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </TableCell>
          )}
        </TableRow>
      )),
    [
      students,
      isAdmin,
      handleDelete,
    ]
  );

  const totalPages =
    total !== null
      ? Math.max(
          1,
          Math.ceil(
            (total ?? 0) / pageSize
          )
        )
      : 1;

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <Box
        sx={{
          mb: {
            xs: 2.5,
            sm: 3,
          },

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

          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "#ecfdf5",
                color: "#0f766e",
              }}
            >
              <PersonIcon />
            </Avatar>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "1.7rem",
                  sm: "2rem",
                  md: "2.125rem",
                },
                color: "#0f172a",
              }}
            >
              Gestion des étudiants
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
            }}
          >
            Consulter, créer et suivre les
            apprenants du centre.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={
              openNewStudentDialog
            }
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1.25,

              alignSelf: {
                xs: "stretch",
                sm: "auto",
              },

              background:
                "linear-gradient(135deg, #0f766e, #059669)",

              boxShadow:
                "0 8px 20px rgba(15, 118, 110, 0.22)",

              textTransform: "none",
              fontWeight: 700,

              "&:hover": {
                background:
                  "linear-gradient(135deg, #115e59, #047857)",
              },
            }}
          >
            Nouvel étudiant
          </Button>
        )}
      </Box>

      {/* ====================================== */}
      {/* CARTE PRINCIPALE */}
      {/* ====================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },

          borderRadius: {
            xs: 3,
            sm: 4,
          },

          border:
            "1px solid #e2e8f0",

          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",

          overflow: "hidden",
        }}
      >
        {/* ================================== */}
        {/* RECHERCHE */}
        {/* ================================== */}

        <Box
          sx={{
            display: "flex",

            gap: 2,

            mb: 2.5,

            alignItems: {
              xs: "stretch",
              sm: "center",
            },

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            justifyContent:
              "space-between",
          }}
        >
          <TextField
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            size="small"
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 380,
              },

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 3,
                  bgcolor: "#fff",
                },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Chip
            icon={<PersonIcon />}
            label={`${students.length} apprenants`}
            color="success"
            variant="outlined"
            sx={{
              width: {
                xs: "fit-content",
                sm: "auto",
              },

              fontWeight: 600,

              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ================================== */}
        {/* ERREUR */}
        {/* ================================== */}

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

        {/* ================================== */}
        {/* LOADING */}
        {/* ================================== */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress
                size={38}
                thickness={4}
                sx={{
                  color: "#0f766e",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Chargement des
                étudiants...
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            {/* ================================= */}
            {/* TABLE */}
            {/* ================================= */}

            <TableContainer
              sx={{
                width: "100%",
                overflowX: "auto",
                borderRadius: 2,
              }}
            >
              <Table
                sx={{
                  minWidth: 760,
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor:
                        "#f8fafc",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#475569",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Matricule
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#475569",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Nom complet
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#475569",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Téléphone
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#475569",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Âge
                    </TableCell>

                    {isAdmin && (
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 800,
                          color: "#475569",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          isAdmin
                            ? 5
                            : 4
                        }
                      >
                        <Box
                          sx={{
                            py: 7,
                            textAlign:
                              "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 58,
                              height: 58,
                              mx: "auto",
                              mb: 2,
                              bgcolor:
                                "#f1f5f9",
                              color:
                                "#64748b",
                            }}
                          >
                            <PersonIcon />
                          </Avatar>

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color:
                                "#334155",
                            }}
                          >
                            Aucun étudiant
                            trouvé
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                            }}
                          >
                            Aucun
                            apprenant ne
                            correspond à
                            votre
                            recherche.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableRows
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ================================= */}
            {/* PAGINATION */}
            {/* ================================= */}

            {total !== null &&
              total > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "center",
                    mt: 3,
                    pt: 2,
                    borderTop:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(
                      _,
                      p
                    ) => setPage(p)}
                    color="primary"
                    shape="rounded"
                    size="medium"
                    siblingCount={1}
                    boundaryCount={1}
                  />
                </Box>
              )}
          </>
        )}
      </Paper>

      {/* ====================================== */}
      {/* DIALOG */}
      {/* ====================================== */}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: {
              xs: 0,
              sm: 4,
            },

            margin: {
              xs: 0,
              sm: 2,
            },

            width: {
              xs: "100%",
              sm: "auto",
            },
          },
        }}
      >
        {/* ================================== */}
        {/* TITRE */}
        {/* ================================== */}

        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            pb: 1,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
              }}
            >
              {isEditMode
                ? "Modifier l'étudiant"
                : "Créer un nouvel étudiant"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {isEditMode
                ? "Modifiez les informations de l'apprenant."
                : "Ajoutez un nouvel apprenant au centre."}
            </Typography>
          </Box>

          <IconButton
            onClick={closeDialog}
            size="small"
            sx={{
              bgcolor: "#f1f5f9",

              "&:hover": {
                bgcolor: "#e2e8f0",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* ================================== */}
        {/* CONTENU */}
        {/* ================================== */}

        <DialogContent
          sx={{
            pt: 2,
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

          <Box
            sx={{
              display: "flex",
              flexDirection:
                "column",
              gap: 2.2,
            }}
          >
            {/* NOM */}

            <TextField
              label="Nom complet"
              placeholder="Ex. Amadou Diallo"
              value={
                formValues.full_name
              }
              onChange={(e) =>
                handleFieldChange(
                  "full_name",
                  e.target.value
                )
              }
              fullWidth
              required
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{
                          color:
                            "#0f766e",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* TELEPHONE */}

            <TextField
              label="Téléphone"
              placeholder="Ex. 70 00 00 00"
              value={
                formValues.phone
              }
              onChange={(e) =>
                handleFieldChange(
                  "phone",
                  e.target.value
                )
              }
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon
                        sx={{
                          color:
                            "#0f766e",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* ADRESSE */}

            <TextField
              label="Adresse"
              placeholder="Ex. Bamako, Sogoniko..."
              value={
                formValues.address
              }
              onChange={(e) =>
                handleFieldChange(
                  "address",
                  e.target.value
                )
              }
              fullWidth
              multiline
              minRows={2}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        alignSelf:
                          "flex-start",
                        mt: 1.5,
                      }}
                    >
                      <LocationOnIcon
                        sx={{
                          color:
                            "#0f766e",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* DATE DE NAISSANCE */}

            <TextField
              label="Date de naissance"
              type="date"
              value={
                formValues.birth_date
              }
              onChange={(e) =>
                handleFieldChange(
                  "birth_date",
                  e.target.value
                )
              }
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon
                        sx={{
                          color:
                            "#0f766e",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* ================================== */}
        {/* ACTIONS */}
        {/* ================================== */}

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            gap: 1,

            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },

            "& > button": {
              width: {
                xs: "100%",
                sm: "auto",
              },
            },
          }}
        >
          <Button
            onClick={closeDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform:
                "none",
              fontWeight: 600,
            }}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              void handleSubmit()
            }
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform:
                "none",
              fontWeight: 700,

              background:
                "linear-gradient(135deg, #0f766e, #059669)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #115e59, #047857)",
              },
            }}
          >
            {isEditMode
              ? "Mettre à jour"
              : "Créer l'étudiant"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Students;