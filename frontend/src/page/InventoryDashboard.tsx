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

import { dummyInventory } from "../datas/dummy";

type FilterType = "state" | "duration";


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

  const {inventory} = useSelector((state: RootState)=> state.inventory)

  console.log("inventory==?", inventory);
  

  const dispatch: AppDispatch = useDispatch()

  const labels = ['Jan 11', 'Jan 21', 'Jan 31', 'Feb 10', 'Feb 20', 'Mar 02', 'Mar 12', 'Mar 22', 'Apr 01', 'Apr 11', 'Apr 21', 'May 01'];
  // const averageMSRPData = inventory.map(item => item.price);
  // const inventoryCount = filteredInventory.length;

  //! need to do the calculations and all to display proper datas


  const prices = dummyInventory.map(item => parseInt(item.price.split(' ')[0], 10));


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const [selectedFilter, setSelectedFilter] = React.useState<string>("");

  const [selectedFilters, setSelectedFilters] = useState<{
    state: string[];
    duration: string[];
  }>({
    state: [],
    duration: [],
  });

  console.log("selectedFilters==?", selectedFilters);
  

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleCheckboxChange = (filterType: FilterType, filterId: string) => {
    setSelectedFilters(prevState => {
      const newFilters = { ...prevState };
      if (newFilters[filterType].includes(filterId)) {
        newFilters[filterType] = newFilters[filterType].filter(id => id !== filterId);
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

  useEffect(() => {
    dispatch(fetchInventory(selectedFilters));
  }, [selectedFilters, dispatch]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  
  const historyLogData = dummyInventory.map((item) => ({
    date: item.timestamp, 
    newItems: 1,
    newTotalMSRP: item.price,
    newAverageMSRP: item.price,
    usdTotalMSRP: item.price, 
    usdAverageMSRP: item.price,
  }))
  

  const cardData = [
    { value: inventory.length ? inventory.length : "379", newInfo: "# New Units" },
    { value: "$13,023.46", newInfo: "New MSRP" },
    { value: "450", newInfo: "New Avg. MSRP" },
    { value: "$15,600.00", newInfo: "# Used Units" },
    { value: "312", newInfo: "Used MSRP" },
    { value: "$10,100.75", newInfo: "Used Avg. MSRP" },
    { value: "500", newInfo: "# CPO Units" },
    { value: "$20,000.00", newInfo: "CPO MSRP" },
  ];

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f7f7f7">
      <Box flex="1" p={0}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#374151", 
            padding: "10px 20px",
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h5" fontWeight="large" color="white" marginRight="10px">
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

            <Button className="flex items-center gap-2 bg-gray-800 text-white rounded-lg px-4 py-2 border">
              <Avatar
                src="/default-avatar.jpg"
                alt="Profile Picture"
                className="w-4 h-4" 
              />
              <span className="text-sm font-medium">Navaneeth V</span>
            </Button>
          </Box>
        </header>

        <Box bgcolor="gray.700" color="white" p={2}>
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
                 onClick={()=>setIsFilterOpen(true)}
>
  Filter by Data
</Button>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3} mb={3}>
  {cardData.map((data, index) => (
    <Grid item xs={3} key={index}>
      <Card>
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


        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h5" fontWeight="large" color="black" marginRight="10px">Inventory Count</Typography>
                  <Box display="flex" gap={1}>
                    {["New", "Used", "CPO"].map((filter) => (
                      <Button
                        key={filter}
                        variant="outlined"
                        onClick={() => handleFilterClick(filter)}
                        style={{
                          backgroundColor: selectedFilter === filter ? "orange" : "white",
                          color: selectedFilter === filter ? "#fff" : "orange",
                          borderColor: selectedFilter === filter ? "orange" : "orange",
                        }}
                      >
                        {filter}
                      </Button>
                    ))}
                  </Box>
                </Box>
                <BarChart labels={labels} data={prices} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h5" fontWeight="large" color="black" marginRight="10px">Average MSRP in USD</Typography>
                  <Box display="flex" gap={1}>
                    {["New", "Used", "CPO"].map((filter) => (
                      <Button
                        key={filter}
                        variant="outlined"
                        onClick={() => handleFilterClick(filter)}
                        style={{
                          backgroundColor: selectedFilter === filter ? "orange" : "white",
                          color: selectedFilter === filter ? "#fff" : "orange",
                          borderColor: selectedFilter === filter ? "orange" : "orange",
                        }}
                      >
                        {filter}
                      </Button>
                    ))}
                  </Box>
                </Box>
                <BarChart labels={labels} data={prices} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container mb={3}>
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
                        {/* Filters can be added here */}
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
                  onPageChange={()=>handleChangePage}
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
  
      {/* State Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-black">MAKE</h3>
        <div className="space-y-1">
        <FormControlLabel
  control={
    <MuiCheckbox
      id="sold"
      checked={selectedFilters.state.includes('sold')}
      onChange={() => handleCheckboxChange('state', 'sold')}
    />
  }
  label="Sold"
  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
/>
<FormControlLabel
  control={
    <MuiCheckbox
      id="pending"
      checked={selectedFilters.state.includes('pending')}
      onChange={() => handleCheckboxChange('state', 'pending')}
    />
  }
  label="Pending"
  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
/>
<FormControlLabel
  control={
    <MuiCheckbox
      id="store"
      checked={selectedFilters.state.includes('store')}
      onChange={() => handleCheckboxChange('state', 'store')}
    />
  }
  label="Store"
  style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
/>

        </div>
      </div>
  
      {/* Duration Filters */}
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
  
      {/* Apply Button */}
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
