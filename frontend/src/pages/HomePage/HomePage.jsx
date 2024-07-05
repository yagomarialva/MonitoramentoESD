import React from "react";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3">
        {t("FCT_Home_Page.Header", { appName: "App for Translations" })}
      </Typography>
      <Typography variant="body1">
        {t("FCT_Home_Page.Label", { appName: "App for Translations" })}
      </Typography>
    </Box>
  );
};

export default HomePage;
