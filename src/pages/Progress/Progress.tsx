import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useProgress } from "../../hooks/useProgress";

function Progress() {
  const {
    progressList,
    loading,
    error,
    page,
    setPage,
    pageSize,
    total,
    search,
    setSearch,
  } = useProgress();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* ========================================================= */}
      {/* HEADER                                                     */}
      {/* ========================================================= */}

      <Box
        sx={{
          mb: { xs: 2.5, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: {
              xs: "1.7rem",
              sm: "2rem",
              md: "2.125rem",
            },
            lineHeight: 1.2,
          }}
        >
          Suivi de progression
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.75,
            fontSize: {
              xs: "0.875rem",
              sm: "0.95rem",
            },
            lineHeight: 1.6,
          }}
        >
          Visualiser l’avancement réel des élèves à travers les niveaux et les
          compétences.
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* CONTENU PRINCIPAL                                          */}
      {/* ========================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
          },
          borderRadius: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          overflow: "hidden",
        }}
      >
        {/* ======================================================= */}
        {/* BARRE DE RECHERCHE                                      */}
        {/* ======================================================= */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
            width: "100%",
          }}
        >
          <TextField
            placeholder="Rechercher par apprenant ou sourate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 360,
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
            icon={<TrendingUpIcon />}
            label="Progression continue"
            color="secondary"
            variant="outlined"
            sx={{
              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
              maxWidth: "100%",
            }}
          />
        </Box>

        {/* ======================================================= */}
        {/* ERREUR                                                   */}
        {/* ======================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* ======================================================= */}
        {/* LOADING                                                  */}
        {/* ======================================================= */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* =================================================== */}
            {/* TABLEAU                                               */}
            {/* =================================================== */}

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
                  minWidth: 700,
                  width: "100%",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Apprenant
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sourate
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Verset actuel
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Séances
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Date mise à jour
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {progressList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{
                          py: 6,
                          color: "text.secondary",
                        }}
                      >
                        Aucune progression enregistrée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    progressList.map((item: any) => (
                      <TableRow
                        key={item.id}
                        hover
                      >
                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.student_name || "—"}
                        </TableCell>

                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.surah_name || "—"}
                        </TableCell>

                        <TableCell>
                          {item.current_verse ?? "—"}
                        </TableCell>

                        <TableCell>
                          {item.total_sessions ?? 0}
                        </TableCell>

                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.updated_at
                            ? new Date(
                                item.updated_at
                              ).toLocaleDateString("fr-FR")
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>

            {/* =================================================== */}
            {/* PAGINATION                                           */}
            {/* =================================================== */}

            {total !== null && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 3,
                  px: 1,
                  overflowX: "auto",
                }}
              >
                <Pagination
                  count={Math.max(
                    1,
                    Math.ceil((total ?? 0) / pageSize)
                  )}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                  size="medium"
                  sx={{
                    "& .MuiPagination-ul": {
                      flexWrap: "nowrap",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Progress;