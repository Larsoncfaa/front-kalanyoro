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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  /*
   * =========================================================
   * DONNÉES POUR LE GRAPHE
   * =========================================================
   */

  const chartData = progressList.map((item: any) => ({
    name: item.student_name || "Inconnu",
    sessions: Number(item.total_sessions ?? 0),
    verse: Number(item.current_verse ?? 0),
  }));

  /*
   * =========================================================
   * STATISTIQUES
   * =========================================================
   */

  const totalSessions = progressList.reduce(
    (totalValue: number, item: any) =>
      totalValue + Number(item.total_sessions ?? 0),
    0
  );

  const totalStudents = new Set(
    progressList
      .map((item: any) => item.student_name)
      .filter(Boolean)
  ).size;

  const totalVersesReached = progressList.reduce(
    (totalValue: number, item: any) =>
      totalValue + Number(item.current_verse ?? 0),
    0
  );

  const averageVerse =
    progressList.length > 0
      ? Math.round(totalVersesReached / progressList.length)
      : 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        overflow: "hidden",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* ========================================================= */}
      {/* HEADER                                                     */}
      {/* ========================================================= */}

      <Box
        sx={{
          mb: {
            xs: 2.5,
            sm: 3.5,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* ICÔNE */}

          <Box
            sx={{
              width: {
                xs: 44,
                sm: 50,
              },
              height: {
                xs: 44,
                sm: 50,
              },
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
              color: "#fff",
              flexShrink: 0,
              boxShadow:
                "0 8px 20px rgba(15,118,110,0.2)",
            }}
          >
            <TrendingUpIcon />
          </Box>

          {/* TITRE */}

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.8rem",
                  md: "2.1rem",
                },
                lineHeight: 1.2,
              }}
            >
              Suivi de progression
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                },
                lineHeight: 1.6,
              }}
            >
              Visualisez l'évolution des apprenants à travers
              leurs séances de Coran.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ========================================================= */}
      {/* STATISTIQUES                                               */}
      {/* ========================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: {
            xs: 1.5,
            sm: 2,
          },
          mb: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* ===================================================== */}
        {/* APPRENANTS                                             */}
        {/* ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Apprenants suivis
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                {totalStudents}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#ecfdf5",
                color: "#047857",
                flexShrink: 0,
              }}
            >
              <SchoolIcon />
            </Box>
          </Box>
        </Paper>

        {/* ===================================================== */}
        {/* SÉANCES                                               */}
        {/* ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Séances réalisées
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                {totalSessions}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#eff6ff",
                color: "#2563eb",
                flexShrink: 0,
              }}
            >
              <EventAvailableIcon />
            </Box>
          </Box>
        </Paper>

        {/* ===================================================== */}
        {/* VERSET MOYEN                                           */}
        {/* ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Verset moyen atteint
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                {averageVerse}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#fefce8",
                color: "#ca8a04",
                flexShrink: 0,
              }}
            >
              <MenuBookIcon />
            </Box>
          </Box>
        </Paper>

        {/* ===================================================== */}
        {/* PROGRESSIONS                                            */}
        {/* ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Progressions actives
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                }}
              >
                {progressList.length}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f3ff",
                color: "#7c3aed",
                flexShrink: 0,
              }}
            >
              <AutoStoriesIcon />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ========================================================= */}
      {/* GRAPHE                                                     */}
      {/* ========================================================= */}

      {!loading &&
        !error &&
        progressList.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
              mb: {
                xs: 2,
                sm: 3,
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
            {/* HEADER GRAPHE */}

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Activité des apprenants
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Nombre de séances réalisées par apprenant
                </Typography>
              </Box>

              <Chip
                icon={<TrendingUpIcon />}
                label="Séances"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* GRAPHE */}

            <Box
              sx={{
                width: "100%",
                height: {
                  xs: 300,
                  sm: 350,
                  md: 400,
                },
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={70}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    formatter={(value) => {
                      const numericValue = Number(
                        value ?? 0
                      );

                      return [
                        `${numericValue} séance${
                          numericValue > 1
                            ? "s"
                            : ""
                        }`,
                        "Activité",
                      ];
                    }}
                    labelFormatter={(label) =>
                      `Apprenant : ${label}`
                    }
                  />

                  <Bar
                    dataKey="sessions"
                    name="Séances"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}

      {/* ========================================================= */}
      {/* TABLEAU PRINCIPAL                                          */}
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
            mb: 2.5,
            width: "100%",
          }}
        >
          <TextField
            placeholder="Rechercher par apprenant ou sourate..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            size="small"
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 360,
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
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
                WebkitOverflowScrolling:
                  "touch",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
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
                        bgcolor: "grey.50",
                      }}
                    >
                      Apprenant
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        bgcolor: "grey.50",
                      }}
                    >
                      Sourate
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        bgcolor: "grey.50",
                      }}
                    >
                      Verset actuel
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        bgcolor: "grey.50",
                      }}
                    >
                      Séances
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        bgcolor: "grey.50",
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
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <TrendingUpIcon
                            sx={{
                              fontSize: 42,
                              color: "text.disabled",
                            }}
                          />

                          <Typography
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Aucune progression
                            enregistrée.
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Les progressions
                            apparaîtront ici
                            après les séances.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    progressList.map(
                      (item: any) => (
                        <TableRow
                          key={item.id}
                          hover
                        >
                          {/* APPRENANT */}

                          <TableCell
                            sx={{
                              whiteSpace:
                                "nowrap",
                              fontWeight: 600,
                            }}
                          >
                            {item.student_name ||
                              "—"}
                          </TableCell>

                          {/* SOURATE */}

                          <TableCell
                            sx={{
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {item.surah_name ||
                              "—"}
                          </TableCell>

                          {/* VERSET */}

                          <TableCell>
                            <Chip
                              size="small"
                              label={`Verset ${
                                item.current_verse ??
                                "—"
                              }`}
                              sx={{
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>

                          {/* SÉANCES */}

                          <TableCell>
                            <Chip
                              size="small"
                              color="primary"
                              variant="outlined"
                              label={
                                item.total_sessions ??
                                0
                              }
                            />
                          </TableCell>

                          {/* DATE */}

                          <TableCell
                            sx={{
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {item.updated_at
                              ? new Date(
                                  item.updated_at
                                ).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "—"}
                          </TableCell>
                        </TableRow>
                      )
                    )
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
                  justifyContent:
                    "center",
                  alignItems: "center",
                  mt: 3,
                  px: 1,
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
                  size="medium"
                  sx={{
                    "& .MuiPagination-ul": {
                      flexWrap:
                        "nowrap",
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