import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";

import { useDashboard } from "../../hooks/useDashboard";
import { useProgress } from "../../hooks/useProgress";

function Reports() {
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboard();

  const {
    progressList,
    loading: progressLoading,
    error: progressError,
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
          mb: {
            xs: 2.5,
            sm: 3,
          },
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
          Rapports et synthèses
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
          Une vue claire et professionnelle des indicateurs clés du centre.
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* ERREURS                                                    */}
      {/* ========================================================= */}

      {(statsError || progressError) && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {statsError || progressError}
        </Alert>
      )}

      {/* ========================================================= */}
      {/* CARTES                                                     */}
      {/* ========================================================= */}

      <Box
        sx={{
          display: "grid",
          gap: {
            xs: 2,
            sm: 3,
          },
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          width: "100%",
        }}
      >
        {/* ======================================================= */}
        {/* SYNTHÈSE RAPIDE                                         */}
        {/* ======================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: {
              xs: 2.5,
              sm: 4,
            },
            border: "1px solid #e2e8f0",
            minHeight: {
              xs: "auto",
              sm: 220,
            },
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          {/* Header de la carte */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(15, 118, 110, 0.1)",
              }}
            >
              <AssessmentIcon color="primary" />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                },
              }}
            >
              Synthèse rapide
            </Typography>
          </Box>

          {/* Loading */}

          {statsLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
              }}
            >
              {/* Étudiants */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  py: 1,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.875rem",
                      sm: "0.95rem",
                    },
                  }}
                >
                  Étudiants enregistrés
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stats?.studentsCount ?? 0}
                </Typography>
              </Box>

              {/* Sessions */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  py: 1,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.875rem",
                      sm: "0.95rem",
                    },
                  }}
                >
                  Sessions Darasa totales
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stats?.sessionsCount ?? 0}
                </Typography>
              </Box>

              {/* Progrès */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  py: 1,
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.875rem",
                      sm: "0.95rem",
                    },
                  }}
                >
                  Progrès suivis
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stats?.progressCount ?? 0}
                </Typography>
              </Box>

              {/* Enseignants */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  py: 1,
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.875rem",
                      sm: "0.95rem",
                    },
                  }}
                >
                  Enseignants actifs
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stats?.teachersCount ?? 0}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        {/* ======================================================= */}
        {/* DERNIERS SUIVIS                                         */}
        {/* ======================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: {
              xs: 2.5,
              sm: 4,
            },
            border: "1px solid #e2e8f0",
            minHeight: {
              xs: "auto",
              sm: 220,
            },
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            overflow: "hidden",
          }}
        >
          {/* Header */}

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Chip
              label="Suivi actif"
              color="success"
              size="small"
              sx={{
                fontWeight: 600,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                },
              }}
            >
              Derniers suivis de progression
            </Typography>
          </Box>

          {/* Loading */}

          {progressLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Table
                size="small"
                sx={{
                  minWidth: 420,
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
                      Sessions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {progressList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{
                          py: 4,
                          color: "text.secondary",
                        }}
                      >
                        Aucun suivi de progression disponible.
                      </TableCell>
                    </TableRow>
                  ) : (
                    progressList
                      .slice(0, 5)
                      .map((item: any) => (
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
                            {item.total_sessions ?? 0}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Reports;