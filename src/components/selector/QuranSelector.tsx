import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useSurahs } from "../../hooks/useSurahs";
import { useVerses } from "../../hooks/useVerses";

interface Props {
  verseStart: number;
  verseEnd: number;
  setVerseStart: (value: number) => void;
  setVerseEnd: (value: number) => void;
  setSurah: (value: number) => void;
}

interface Verse {
  id: number;
  verse_number: number;
  text_ar: string;
  text_fr: string;
}

export default function QuranSelector({
  verseStart,
  verseEnd,
  setVerseStart,
  setVerseEnd,
  setSurah,
}: Props) {
  const { surahs } = useSurahs();

  const [selectedSurah, setSelectedSurah] = useState<number>(0);

  const { verses, loading } = useVerses(selectedSurah);

  const handleSurahChange = (id: number) => {
    setSelectedSurah(id);
    setSurah(id);

    setVerseStart(0);
    setVerseEnd(0);
  };

  const handleVerseClick = (number: number) => {
    if (!verseStart) {
      setVerseStart(number);
    } else if (!verseEnd) {
      if (number < verseStart) {
        setVerseStart(number);
        setVerseEnd(0);
      } else {
        setVerseEnd(number);
      }
    } else {
      setVerseStart(number);
      setVerseEnd(0);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 3 },
        width: "100%",
      }}
    >
      {/* Sélection de la sourate */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 2.5, sm: 4 },
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: { xs: 2, sm: 2.5 },
          }}
        >
          <Box
            sx={{
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #0f766e, #059669)",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <MenuBookIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1rem", sm: "1.15rem" },
                color: "#0f172a",
              }}
            >
              Choisir une sourate
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.25,
                display: { xs: "none", sm: "block" },
              }}
            >
              Sélectionnez la sourate à étudier
            </Typography>
          </Box>
        </Box>

        <FormControl fullWidth>
          <InputLabel id="quran-surah-label">Sourate</InputLabel>

          <Select
            labelId="quran-surah-label"
            value={selectedSurah}
            label="Sourate"
            onChange={(e) =>
              handleSurahChange(Number(e.target.value))
            }
            sx={{
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <MenuItem value={0}>
              Sélectionner une sourate
            </MenuItem>

            {surahs.map((surah: any) => (
              <MenuItem key={surah.id} value={surah.id}>
                {surah.number}. {surah.name_fr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Lecture des versets */}
      {selectedSurah > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 3 },
            borderRadius: { xs: 2.5, sm: 4 },
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              px: { xs: 0.5, sm: 0 },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ecfdf5",
                color: "#047857",
                flexShrink: 0,
              }}
            >
              <AutoStoriesIcon />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  color: "#0f172a",
                }}
              >
                Lecture du Coran
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: { xs: "none", sm: "block" },
                  mt: 0.25,
                }}
              >
                Cliquez sur les versets pour définir la plage
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Chargement */}
          {loading ? (
            <Box
              sx={{
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <CircularProgress size={34} />

              <Typography color="text.secondary">
                Chargement des versets...
              </Typography>
            </Box>
          ) : verses.length === 0 ? (
            <Box
              sx={{
                minHeight: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Typography color="text.secondary">
                Aucun verset disponible pour cette sourate.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: { xs: 500, sm: 600, md: 700 },
                overflowY: "auto",
                overflowX: "hidden",
                pr: { xs: 0.5, sm: 1 },

                "&::-webkit-scrollbar": {
                  width: "6px",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#cbd5e1",
                  borderRadius: "10px",
                },

                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              {verses.map((verse: Verse) => {
                const selected =
                  verse.verse_number >= verseStart &&
                  verse.verse_number <= verseEnd;

                const isStart = verse.verse_number === verseStart;
                const isEnd = verse.verse_number === verseEnd;

                return (
                  <Box
                    key={verse.id}
                    onClick={() =>
                      handleVerseClick(verse.verse_number)
                    }
                    sx={{
                      p: { xs: 1.5, sm: 2.5 },
                      mb: { xs: 1, sm: 1.5 },
                      cursor: "pointer",
                      borderRadius: { xs: 2, sm: 2.5 },

                      border: selected
                        ? "1px solid #86efac"
                        : "1px solid transparent",

                      backgroundColor: selected
                        ? "#f0fdf4"
                        : "#ffffff",

                      transition: "all 0.2s ease",

                      "&:hover": {
                        backgroundColor: selected
                          ? "#ecfdf5"
                          : "#f8fafc",
                        borderColor: selected
                          ? "#86efac"
                          : "#e2e8f0",
                      },

                      "&:active": {
                        transform: "scale(0.995)",
                      },
                    }}
                  >
                    {/* Numéro du verset */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        size="small"
                        label={`Verset ${verse.verse_number}`}
                        icon={
                          selected ? (
                            <CheckCircleIcon />
                          ) : undefined
                        }
                        sx={{
                          fontWeight: 600,
                          backgroundColor: selected
                            ? "#dcfce7"
                            : "#f1f5f9",
                          color: selected
                            ? "#166534"
                            : "#475569",
                        }}
                      />

                      {isStart && (
                        <Chip
                          size="small"
                          label="Début"
                          color="success"
                          variant="outlined"
                        />
                      )}

                      {isEnd && !isStart && (
                        <Chip
                          size="small"
                          label="Fin"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {/* Texte arabe */}
                    <Typography
                      sx={{
                        direction: "rtl",
                        textAlign: "right",
                        fontSize: {
                          xs: "1.45rem",
                          sm: "1.8rem",
                          md: "2rem",
                        },
                        lineHeight: {
                          xs: 2,
                          sm: 2.1,
                        },
                        mt: 1,
                        fontFamily:
                          '"Amiri", "Noto Naskh Arabic", serif',
                        color: "#1e293b",
                        wordBreak: "break-word",
                      }}
                    >
                      {verse.text_ar}
                    </Typography>

                    {/* Séparateur */}
                    <Divider
                      sx={{
                        my: 1.5,
                        opacity: 0.5,
                      }}
                    />

                    {/* Traduction */}
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "0.9rem",
                          sm: "1rem",
                        },
                        lineHeight: 1.7,
                        color: "#475569",
                      }}
                    >
                      {verse.text_fr}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      )}

      {/* Résumé de la sélection */}
      {verseStart > 0 && verseEnd > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 2.5, sm: 3 },
            border: "1px solid #bbf7d0",
            background:
              "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1.5,
            }}
          >
            <CheckCircleIcon
              sx={{
                color: "#16a34a",
                fontSize: 26,
              }}
            />

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#166534",
                  fontWeight: 600,
                  mb: 0.25,
                }}
              >
                Plage sélectionnée
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#14532d",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1rem",
                  },
                }}
              >
                Versets {verseStart} - {verseEnd}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}