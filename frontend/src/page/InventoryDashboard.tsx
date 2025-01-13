import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  TablePagination,
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@mui/material";

type FilterType = "brand" | "duration";

import { fetchInventory } from "../feature/redux/inventory/inventorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../feature/redux/store";
import { BarChart } from "../components/BarChart";
import SupportIcon from '@mui/icons-material/Support';
import FilterListIcon from '@mui/icons-material/FilterList';
import { RootState } from "../feature/redux/store";

export default function InventoryDashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [countChartFilter, setCountChartFilter] = useState("")
  const [avgMsrpFilter, setAvgMsrpFilter] = useState("")

  const [selectedFilters, setSelectedFilters] = useState<{
    brand: string[];
    duration: string[];
  }>({
    brand: [],
    duration: [],
  });

  const dispatch: AppDispatch = useDispatch()

  const { inventory } = useSelector((state: RootState) => state.inventory)

  useEffect(() => {
    dispatch(fetchInventory({ brand: [], duration: [] })); // Load all data initially
  }, [dispatch]);

  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatMonth = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const counts = labels.map((label) => {
    const filteredData = inventory.filter(item => {
      const itemMonth = formatMonth(item.timestamp);
      const matchesMonth = itemMonth === label;

      const matchesCategory = countChartFilter ? item.condition === countChartFilter : true;

      return matchesMonth && matchesCategory;
    });

    return filteredData.length;
  });


  const msrp = labels.map((label) => {
    const filteredData = inventory.filter(item => {
      const itemMonth = formatMonth(item.timestamp);
      const matchesMonth = itemMonth === label;

      const matchesCategory = avgMsrpFilter ? item.condition === avgMsrpFilter : true;

      return matchesMonth && matchesCategory;
    });

    return filteredData.length;
  });


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleCheckboxChange = (filterType: FilterType, filterId: string) => {
    setSelectedFilters((prevState) => {
      const newFilters = { ...prevState };
      if (newFilters[filterType].includes(filterId)) {
        newFilters[filterType] = newFilters[filterType].filter((id) => id !== filterId);
      } else {
        newFilters[filterType].push(filterId);
      }
      return newFilters;
    });
  };
  

  const handleApplyFilters = () => {
    console.log("Applied Filters:", selectedFilters);
    dispatch(fetchInventory(selectedFilters));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleCountChartFilterClick = (filter: string) => {
    setCountChartFilter(filter)
  }

  const handleMsrpChartFilterClick = (filter: string) => {
    setAvgMsrpFilter(filter)
  }

  const newInventory = inventory.filter((item) => item.condition === "new")
  const newMsrp = inventory.filter((item) => item.condition === "new")
  const totalPrice = newMsrp.reduce(
    (total, item) => total + parseInt(item.price),
    0
  );
  const avgMsrp = totalPrice / newMsrp.length;
  const usedInventory = inventory.filter((item) => item.condition === "used")
  const usedMsrp = inventory.filter((item) => item.condition === "used")
  const totalPriceUsed = usedMsrp.reduce(
    (total, item) => total + parseInt(item.price),
    0
  );
  const avgMsrpUsed = totalPriceUsed / usedMsrp.length;
  const cpoInventory = inventory.filter((item) => item.condition === "cpo")
  const cpoMsrp = inventory.filter((item) => item.condition === "cpo")
  const totalPriceCpo = cpoMsrp.reduce(
    (total, item) => total + parseInt(item.price),
    0
  );

  const formattedPrice = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPrice);
  const formattedAvgMsrp = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(avgMsrp);
  const formattedPriceUsed = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPriceUsed);
  const formattedAvgMsrpUsed = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(avgMsrpUsed);
  const formattedPriceCpo = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPriceCpo);

  const cardData = [
    { value: newInventory.length ? newInventory.length : "0", newInfo: "# New Units" },
    { value: totalPrice ? formattedPrice : "$0", newInfo: "New MSRP" },
    { value: avgMsrp ? formattedAvgMsrp : "0", newInfo: "New Avg. MSRP" },
    { value: usedInventory ? usedInventory.length : "$0", newInfo: "# Used Units" },
    { value: totalPriceUsed ? formattedPriceUsed : "$0", newInfo: "Used MSRP" },
    { value: avgMsrpUsed ? formattedAvgMsrpUsed : "$0", newInfo: "Used Avg. MSRP" },
    { value: cpoInventory ? cpoInventory.length :"0", newInfo: "# CPO Units" },
    { value: totalPriceCpo ? formattedPriceCpo :"$0", newInfo: "CPO MSRP" },
  ];

  const historyLogData = inventory.map((item) => ({
    date: item.timestamp,
    newItems: item.custom_label_0,
    newTotalMSRP: item.price,
    newAverageMSRP: item.price,
    usdTotalMSRP: item.price,
    usdAverageMSRP: item.price,
  }))

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f7f7f7">
      <Box flex="1" p={0}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1F1F1F",
            padding: "10px 40px",
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h5" className="text-lg" color="white" marginRight="10px">
              Admin Console
            </Typography>
            <span className="inline-flex items-center bg-gray-200 text-black font-medium text-xs px-5 py-1.5 rounded-full">
              ADMIN VIEW
            </span>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                color: "#4A4A4A",
                textTransform: "none",
              }}
            >
              <SupportIcon
                sx={{
                  width: 24,
                  height: 24,
                  color: 'orange'
                }}
              />
              <Typography variant="body2" color="white">
                Support
              </Typography>
            </Button>

            <Button
              className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-3 py-1.5 border border-gray-600 hover:bg-gray-700 transition duration-200"
            >
              <Avatar
                src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                alt="Profile Picture"
                sx={{ width: 26, height: 26 }}
              />
              <span className="text-sm font-medium text-white truncate">Navaneeth V</span>
            </Button>



          </Box>
        </header>

        <Box bgcolor="gray.700" color="white" p={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" fontWeight="bold" color="black">
                Inventory
              </Typography>
            </Grid>

            <Grid item>
              <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Select Dealer
                  </Typography>
                </Grid>

                <Grid item>
                  <FormControl variant="outlined" size="small">
                    <Select
                      defaultValue=""
                      id="dealer-select"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Choose Dealer
                      </MenuItem>
                      <MenuItem value={10}>Dealer 1</MenuItem>
                      <MenuItem value={20}>Dealer 2</MenuItem>
                      <MenuItem value={30}>Dealer 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item>
                  <Button
                    startIcon={<FilterListIcon sx={{ color: 'orange' }} />}
                    color="primary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      textTransform: 'none',
                    }}
                    onClick={() => setIsFilterOpen(true)}
                  >
                    Filter by Data
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={1} mb={1} p={5}>
          {cardData.map((data, index) => (
            <Grid item xs={1.5} key={index}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold">
                    {data.value}
                  </Typography>
                  <Typography variant="caption" color="orange">
                    {data.newInfo}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} mb={3} p={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h5" fontWeight="large" color="black" marginRight="10px">Inventory Count</Typography>
                  <Box display="flex" gap={1}>
                    {["new", "used", "cpo"].map((filter) => (
                      <Button
                        key={filter}
                        variant="outlined"
                        onClick={() => handleCountChartFilterClick(filter)}
                        style={{
                          backgroundColor: countChartFilter === filter ? "orange" : "white",
                          color: countChartFilter === filter ? "#fff" : "orange",
                          borderColor: countChartFilter === filter ? "orange" : "orange",
                        }}
                      >
                        {filter}
                      </Button>
                    ))}
                  </Box>
                </Box>
                <BarChart labels={labels} data={counts} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3} p={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h5" fontWeight="large" color="black" marginRight="10px">Average MSRP in USD</Typography>
                  <Box display="flex" gap={1}>
                    {["new", "used", "cpo"].map((filter) => (
                      <Button
                        key={filter}
                        variant="outlined"
                        onClick={() => handleMsrpChartFilterClick(filter)}
                        style={{
                          backgroundColor: avgMsrpFilter === filter ? "orange" : "white",
                          color: avgMsrpFilter === filter ? "#fff" : "orange",
                          borderColor: avgMsrpFilter === filter ? "orange" : "orange",
                        }}
                      >
                        {filter}
                      </Button>
                    ))}
                  </Box>
                </Box>
                <BarChart labels={labels} data={msrp} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container mb={3} p={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight="large" color="black">
                    History Log
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button variant="outlined" color="primary" onClick={toggleFilter}>
                      Filters
                    </Button>
                    <Drawer anchor="right" open={isFilterOpen} onClose={toggleFilter}>
                      <div style={{ width: 250, padding: 20 }}>
                      </div>
                    </Drawer>
                  </Box>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>DATE</TableCell>
                        <TableCell>NEW INVENTORY</TableCell>
                        <TableCell>NEW TOTAL MSRP</TableCell>
                        <TableCell>NEW AVERAGE MSRP</TableCell>
                        <TableCell>USED INVENTORY</TableCell>
                        <TableCell>USED INVENTORY</TableCell>
                        <TableCell>USED TOTAL MSRP</TableCell>
                        <TableCell>USED AVERAGE MSRP</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyLogData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.newItems}</TableCell>
                          <TableCell>${row.newTotalMSRP}</TableCell>
                          <TableCell>${row.newAverageMSRP}</TableCell>
                          <TableCell>{row.newItems}</TableCell>
                          <TableCell>${row.usdTotalMSRP}</TableCell>
                          <TableCell>${row.usdAverageMSRP}</TableCell>
                          <TableCell>${row.newAverageMSRP}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[6, 10, 15]}
                  component="div"
                  count={historyLogData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={() => handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {isFilterOpen && (
        <Drawer anchor="right" open={isFilterOpen} onClose={toggleFilter}>
          <div className="w-[390px] p-6">
            <Typography variant="h6" fontWeight="bold" color="black" marginBottom="10px">
              Filter By Data
            </Typography>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-black">MAKE</h3>
              <div className="space-y-1">
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      id="sold"
                      checked={selectedFilters.brand.includes('jeep')}
                      onChange={() => handleCheckboxChange('brand', 'jeep')}
                    />
                  }
                  label="Jeep"
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
                />
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      id="pending"
                      checked={selectedFilters.brand.includes('Chevrolet')}
                      onChange={() => handleCheckboxChange('brand', 'Chevrolet')}
                    />
                  }
                  label="Chevrolet"
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
                />
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      id="store"
                      checked={selectedFilters.brand.includes('GMC')}
                      onChange={() => handleCheckboxChange('brand', 'GMC')}
                    />
                  }
                  label="GMC"
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
                />

              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">DURATION</h3>
              <div className="space-y-1">
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      id="last-month"
                      checked={selectedFilters.duration.includes('last-month')}
                      onChange={() => handleCheckboxChange('duration', 'last-month')}
                    />
                  }
                  label="Last Month"
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}

                />
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      id="this-month"
                      checked={selectedFilters.duration.includes('this-month')}
                      onChange={() => handleCheckboxChange('duration', 'this-month')}
                    />
                  }
                  label="This Month"
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}

                />
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      id="last-3-months"
                      checked={selectedFilters.duration.includes('last-3-months')}
                      onChange={() => handleCheckboxChange('duration', 'last-3-months')}
                    />
                  }
                  label="Last 3 Months"
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}

                />
              </div>
            </div>
            <Button
              onClick={handleApplyFilters}
              variant="contained"
              color="primary"
              className="w-full mt-6"
            >
              Apply Filters
            </Button>
          </div>
        </Drawer>
      )}
    </Box>
  );
}
