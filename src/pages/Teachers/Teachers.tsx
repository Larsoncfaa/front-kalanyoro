import { useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Pagination,
  Alert,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

import { useTeachers } from "../../hooks/useTeachers";

const initialForm = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  role: "TEACHER",
  is_active: true,
};

function Teachers() {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const {
    teachers,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
    addTeacher,
    editTeacher,
    removeTeacher,
  } = useTeachers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formValues, setFormValues] = useState(initialForm);

  const [selectedTeacherId, setSelectedTeacherId] =
    useState<number | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const openNewTeacherDialog = () => {
    setFormValues({ ...initialForm });
    setSelectedTeacherId(null);
    setIsEditMode(false);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditTeacherDialog = (teacher: any) => {
    setFormValues({
      username: teacher.username || "",
      password: "",
      first_name: teacher.first_name || "",
      last_name: teacher.last_name || "",
      phone: teacher.phone || "",
      role: teacher.role || "TEACHER",
      is_active: Boolean(teacher.is_active),
    });

    setSelectedTeacherId(teacher.id);
    setIsEditMode(true);
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setFormError(null);
    setSelectedTeacherId(null);
    setFormValues({ ...initialForm });
  };

  const handleFieldChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError(null);
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!formValues.username.trim()) {
      setFormError(
        "Le nom d'utilisateur est requis."
      );
      return;
    }

    if (!isEditMode && !formValues.password) {
      setFormError(
        "Le mot de passe est requis pour créer un compte."
      );
      return;
    }

    if (
      !isEditMode &&
      formValues.password.length < 8
    ) {
      setFormError(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    const payload = {
      username: formValues.username.trim(),
      first_name: formValues.first_name.trim(),
      last_name: formValues.last_name.trim(),
      phone: formValues.phone.trim(),
      role: formValues.role,
      is_active: formValues.is_active,
      ...(formValues.password
        ? { password: formValues.password }
        : {}),
    };

    try {
      setSaving(true);

      if (
        isEditMode &&
        selectedTeacherId !== null
      ) {
        await editTeacher(
          selectedTeacherId,
          payload
        );
      } else {
        await addTeacher(payload);
      }

      closeDialog();
    } catch (err: any) {
      setFormError(
        err?.message ||
          "Impossible de sauvegarder l'enseignant."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = window.confirm(
        "Supprimer cet enseignant ? Cette action est irréversible."
      );

      if (!confirmed) return;

      try {
        await removeTeacher(id);
      } catch {
        // L'erreur est gérée par le hook.
      }
    },
    [removeTeacher]
  );

  const tableRows = useMemo(
    () =>
      teachers.map((teacher: any) => (
        <TableRow
          key={teacher.id}
          hover
          sx={{
            "&:last-child td, &:last-child th": {
              border: 0,
            },
          }}
        >
          {/* USERNAME */}
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 180,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  flexShrink: 0,
                }}
              >
                <PersonIcon fontSize="small" />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                {teacher.username}
              </Typography>
            </Box>
          </TableCell>

          {/* NOM */}
          <TableCell>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              {`${teacher.first_name || ""} ${
                teacher.last_name || ""
              }`.trim() || "—"}
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
              {teacher.phone && (
                <PhoneIcon
                  sx={{
                    fontSize: 18,
                    color: "text.secondary",
                  }}
                />
              )}

              <Typography variant="body2">
                {teacher.phone || "—"}
              </Typography>
            </Box>
          </TableCell>

          {/* ROLE */}
          <TableCell>
            <Chip
              size="small"
              icon={<BadgeIcon />}
              label={
                teacher.role === "ADMIN"
                  ? "Administrateur"
                  : "Enseignant"
              }
              color={
                teacher.role === "ADMIN"
                  ? "primary"
                  : "success"
              }
              variant="outlined"
            />
          </TableCell>

          {/* STATUS */}
          <TableCell>
            <Chip
              size="small"
              icon={
                teacher.is_active ? (
                  <CheckCircleIcon />
                ) : (
                  <BlockIcon />
                )
              }
              label={
                teacher.is_active
                  ? "Actif"
                  : "Désactivé"
              }
              color={
                teacher.is_active
                  ? "success"
                  : "error"
              }
              variant="outlined"
            />
          </TableCell>

          {/* ACTIONS */}
          {isAdmin && (
            <TableCell align="right">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() =>
                    openEditTeacherDialog(
                      teacher
                    )
                  }
                  title="Modifier"
                  sx={{
                    bgcolor: "#eff6ff",
                    "&:hover": {
                      bgcolor: "#dbeafe",
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
                      teacher.id
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
    [teachers, isAdmin, handleDelete]
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <Box
        sx={{
          mb: { xs: 2.5, md: 3.5 },
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
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              fontSize: {
                xs: "1.7rem",
                sm: "2rem",
                md: "2.125rem",
              },
            }}
          >
            Gestion des enseignants
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
              },
            }}
          >
            Gérer les comptes et les informations
            des enseignants du centre.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openNewTeacherDialog}
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1.2,
              alignSelf: {
                xs: "stretch",
                sm: "auto",
              },
              textTransform: "none",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
              boxShadow:
                "0 8px 20px rgba(5,150,105,0.20)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #115e59, #047857)",
              },
            }}
          >
            Nouvel enseignant
          </Button>
        )}
      </Box>

      {/* ========================= */}
      {/* MAIN CARD */}
      {/* ========================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          borderRadius: {
            xs: 3,
            md: 4,
          },
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          overflow: "hidden",
        }}
      >
        {/* SEARCH BAR */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <TextField
            placeholder="Rechercher un enseignant..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            size="small"
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 380,
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
            label={`${teachers.length} enseignant${
              teachers.length > 1 ? "s" : ""
            }`}
            color="success"
            variant="outlined"
            sx={{
              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
              fontWeight: 600,
            }}
          />
        </Box>

        {/* ERROR */}

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

        {/* LOADING */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* TABLE RESPONSIVE */}

            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                borderRadius: 2,
              }}
            >
              <Table
                sx={{
                  minWidth: 850,
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Nom d’utilisateur
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Nom complet
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Téléphone
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Rôle
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Statut
                    </TableCell>

                    {isAdmin && (
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {teachers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 6 : 5}
                        align="center"
                      >
                        <Box
                          sx={{
                            py: 6,
                            px: 2,
                          }}
                        >
                          <PersonIcon
                            sx={{
                              fontSize: 48,
                              color:
                                "text.disabled",
                              mb: 1,
                            }}
                          />

                          <Typography
                            color="text.secondary"
                          >
                            Aucun enseignant
                            trouvé.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableRows
                  )}
                </TableBody>
              </Table>
            </Box>

            {/* PAGINATION */}

            {total !== null && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  pt: 2,
                  borderTop:
                    "1px solid #e2e8f0",
                  overflowX: "auto",
                }}
              >
                <Pagination
                  count={Math.max(
                    1,
                    Math.ceil(
                      (total ?? 0) /
                        pageSize
                    )
                  )}
                  page={page}
                  onChange={(_, p) =>
                    setPage(p)
                  }
                  color="primary"
                  shape="rounded"
                  size="small"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* ========================= */}
      {/* DIALOG */}
      {/* ========================= */}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={false}
        sx={{
          "& .MuiDialog-container": {
            p: {
              xs: 1,
              sm: 2,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            pb: 1,
          }}
        >
          {isEditMode
            ? "Modifier l'enseignant"
            : "Créer un nouvel enseignant"}
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "12px !important",
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
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* USERNAME */}

            <TextField
              label="Nom d'utilisateur"
              value={formValues.username}
              onChange={(e) =>
                handleFieldChange(
                  "username",
                  e.target.value
                )
              }
              fullWidth
              required
              disabled={saving}
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* PASSWORD */}

            <TextField
              label="Mot de passe"
              type="password"
              value={formValues.password}
              onChange={(e) =>
                handleFieldChange(
                  "password",
                  e.target.value
                )
              }
              fullWidth
              disabled={saving}
              helperText={
                isEditMode
                  ? "Laisser vide pour conserver le mot de passe actuel."
                  : "Minimum 8 caractères."
              }
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* FIRST NAME */}

            <TextField
              label="Prénom"
              value={formValues.first_name}
              onChange={(e) =>
                handleFieldChange(
                  "first_name",
                  e.target.value
                )
              }
              fullWidth
              disabled={saving}
            />

            {/* LAST NAME */}

            <TextField
              label="Nom"
              value={formValues.last_name}
              onChange={(e) =>
                handleFieldChange(
                  "last_name",
                  e.target.value
                )
              }
              fullWidth
              disabled={saving}
            />

            {/* PHONE */}

            <TextField
              label="Téléphone"
              value={formValues.phone}
              onChange={(e) =>
                handleFieldChange(
                  "phone",
                  e.target.value
                )
              }
              fullWidth
              disabled={saving}
            />

            {/* ROLE */}

            <FormControl
              fullWidth
              disabled={saving}
            >
              <InputLabel id="role-label">
                Rôle
              </InputLabel>

              <Select
                labelId="role-label"
                value={formValues.role}
                label="Rôle"
                onChange={(
                  event: SelectChangeEvent
                ) =>
                  handleFieldChange(
                    "role",
                    event.target.value
                  )
                }
              >
                <MenuItem value="TEACHER">
                  Enseignant
                </MenuItem>

                <MenuItem value="ADMIN">
                  Administrateur
                </MenuItem>
              </Select>
            </FormControl>

            {/* STATUS */}

            <FormControl
              fullWidth
              disabled={saving}
            >
              <InputLabel id="status-label">
                Statut
              </InputLabel>

              <Select
                labelId="status-label"
                value={
                  formValues.is_active
                    ? "active"
                    : "inactive"
                }
                label="Statut"
                onChange={(
                  event: SelectChangeEvent
                ) =>
                  handleFieldChange(
                    "is_active",
                    event.target.value ===
                      "active"
                  )
                }
              >
                <MenuItem value="active">
                  Actif
                </MenuItem>

                <MenuItem value="inactive">
                  Désactivé
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            gap: 1,
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          <Button
            onClick={closeDialog}
            disabled={saving}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={() => void handleSubmit()}
            disabled={saving}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #115e59, #047857)",
              },
            }}
          >
            {saving
              ? "Enregistrement..."
              : isEditMode
              ? "Mettre à jour"
              : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Teachers;