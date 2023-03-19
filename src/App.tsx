import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import TabPanel from "./components/navigation/TabPanel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Cena vs. Vynosy",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => Math.random() * 2000 - 1000),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => Math.random() * 2000 - 1000),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

enum TabName {
  TABLE = "table",
  GRAPH = "graph",
}

interface FormValues {
  price: number | "";
  revenue: number | "";
  numOfUnits: number | "";
}

interface TableValue {
  id: number;
  price: number;
  revenue: number;
}

function App() {
  const theme = useTheme();
  const [tableValues, setTableValues] = useState<TableValue[] | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      price: "",
      revenue: "",
      numOfUnits: "",
    },
    validationSchema: Yup.object({
      price: Yup.number().positive().required("Required"),
      revenue: Yup.number().positive().required("Required"),
      numOfUnits: Yup.number().integer().positive().required("Required"),
    }),
    onSubmit: ({ price, revenue, numOfUnits }) => {
      if (price == "") {
        console.error(
          "price is required but got through validation => fix validation schema"
        );
        return;
      }
      if (revenue == "") {
        console.error(
          "revenue is required but got through validation => fix validation schema"
        );
        return;
      }
      if (numOfUnits == "") {
        console.error(
          "numOfUnits is required but got through validation => fix validation schema"
        );
        return;
      }

      // generate table values;
      const tableValues: TableValue[] = [];

      for (let i = 0; i <= numOfUnits; i++) {
        const value: TableValue = {
          id: i,
          price: price - i * (price / numOfUnits),
          revenue: revenue * i,
        };

        tableValues.push(value);
      }

      setTableValues(tableValues);
    },
  });

  const [tab, setTab] = useState<TabName>(TabName.TABLE);

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabName) => {
    setTab(newValue);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Obdobie",
      width: 150,
      sortable: false,
      filterable: false,
      hideable: false,
    },
    {
      field: "price",
      headerName: "Cena",
      sortable: false,
      filterable: false,
      hideable: false,
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "revenue",
      headerName: "Vynos",
      sortable: false,
      filterable: false,
      hideable: false,
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
  ];

  const chartLabels = tableValues?.map((value) => value.id) ?? [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Cena",
        data: tableValues?.map((value) => value.price),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Vynosy",
        data: tableValues?.map((value) => value.revenue),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Card sx={{ mt: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <CardHeader
            title="Vypocet vynosnosti"
            subheader="Vypln formular a potvrd prepocet"
          />

          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  label="Cena"
                  name="price"
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  error={
                    formik.touched.price != null && formik.errors.price != null
                  }
                  helperText={
                    formik.touched.price != null && formik.errors.price != null
                      ? formik.errors.price
                      : undefined
                  }
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Vynos za 1 jednotku obdobia"
                  name="revenue"
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.revenue}
                  error={
                    formik.touched.revenue != null &&
                    formik.errors.revenue != null
                  }
                  helperText={
                    formik.touched.revenue != null &&
                    formik.errors.revenue != null
                      ? formik.errors.revenue
                      : undefined
                  }
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Pocet jednotiek obdobia"
                  name="numOfUnits"
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.numOfUnits}
                  error={
                    formik.touched.numOfUnits != null &&
                    formik.errors.numOfUnits != null
                  }
                  helperText={
                    formik.touched.numOfUnits != null &&
                    formik.errors.numOfUnits != null
                      ? formik.errors.numOfUnits
                      : undefined
                  }
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions>
            <Button variant="contained" type="submit" fullWidth>
              Prepocitat
            </Button>
          </CardActions>
        </form>
      </Card>

      {tableValues != null && (
        <Card sx={{ mt: 2, mb: 2 }}>
          <AppBar position="static">
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="inherit"
            >
              <Tab label="Tabulka" value={TabName.TABLE} />
              <Tab label="Graf" value={TabName.GRAPH} />
            </Tabs>
          </AppBar>

          <TabPanel value={tab} index={TabName.TABLE} dir={theme.direction}>
            <Box sx={{ height: 500 }}>
              <DataGrid
                rows={tableValues}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
              />
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={TabName.GRAPH} dir={theme.direction}>
            <Line options={chartOptions} data={chartData} />
          </TabPanel>
        </Card>
      )}
    </Container>
  );
}

export default App;

