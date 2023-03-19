import Box from "@mui/material/Box";

export interface TabPanelProps<T> {
  children?: React.ReactNode;
  dir?: string;
  index: T;
  value: T;
}

function TabPanel<T>(props: TabPanelProps<T>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default TabPanel;
