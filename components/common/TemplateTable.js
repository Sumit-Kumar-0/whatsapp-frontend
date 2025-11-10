import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TableSortLabel, Paper,
  TextField, IconButton, Tooltip, Box, Typography, InputAdornment,
  Chip, CircularProgress
} from '@mui/material';
import { Search, Edit, Delete, Visibility, MoreVert } from '@mui/icons-material';

const CommonTable = ({
  data = [],
  columns = [],
  actions = [],
  renderActions,
  searchable = true, // TemplatePage में अलग search है
  pagination = true, // TemplatePage में अलग pagination है
  loading = false,
  onSort,
  onRowClick
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  // 🔍 Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm) return safeData;
    const term = searchTerm.toLowerCase();
    return safeData.filter(row =>
      safeColumns.some(col => {
        const value = row[col.field];
        if (value == null) return false;
        return value.toString().toLowerCase().includes(term);
      })
    );
  }, [safeData, searchTerm, safeColumns]);

  // ↕️ Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return order === 'asc' ? -1 : 1;
      if (bVal == null) return order === 'asc' ? 1 : -1;
      
      // Handle different data types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      // Handle numbers and dates
      return order === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });
  }, [filteredData, orderBy, order]);

  // 📄 Paginate data
  const paginatedData = useMemo(() => (
    pagination
      ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData
  ), [sortedData, page, rowsPerPage, pagination]);

  // Handle sort
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
    
    // Call external sort handler if provided
    if (onSort) {
      onSort(field, isAsc ? 'desc' : 'asc');
    }
  };

  // Render cell content based on column type
  const renderCellContent = (row, column) => {
    const value = row[column.field];
    
    // Custom render function
    if (column.renderCell) {
      return column.renderCell(row);
    }
    
    // Chip type
    if (column.type === 'chip') {
      const chipColor = typeof column.chipColor === 'function' 
        ? column.chipColor(value) 
        : column.chipColor;
      const chipLabel = typeof column.chipLabel === 'function'
        ? column.chipLabel(value)
        : value;
      
      return (
        <Chip 
          label={chipLabel} 
          color={chipColor || 'default'}
          size="small"
          variant="outlined"
        />
      );
    }
    
    // Date type
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    // Default text rendering
    return renderText(value, column.maxLength || 50);
  };

  // ✂️ Truncate text with tooltip
  const renderText = (value, max = 50) => {
    if (value == null) return '-';
    const text = String(value);
    const truncated = text.length > max ? text.slice(0, max) + '…' : text;
    
    if (text.length <= max) {
      return (
        <Typography variant="body2">
          {text}
        </Typography>
      );
    }
    
    return (
      <Tooltip title={text} placement="top" arrow>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 250,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'help',
          }}
        >
          {truncated}
        </Typography>
      </Tooltip>
    );
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* 🔍 Search box - Only if enabled */}
      {searchable && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search in table..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trimStart())}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>
      )}

      {/* 🧾 Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {safeColumns.map(col => (
                <TableCell
                  key={col.field}
                  sortDirection={orderBy === col.field ? order : false}
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: 'background.paper',
                    minWidth: col.minWidth || 'auto',
                    width: col.width || 'auto'
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : 'asc'}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
              
              {/* Actions column - Only if actions or renderActions provided */}
              {(actions.length > 0 || renderActions) && (
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    minWidth: 100,
                    width: 100
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow 
                  key={row._id || row.id || index} 
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: onRowClick ? 'action.hover' : 'inherit'
                    }
                  }}
                >
                  {safeColumns.map(col => (
                    <TableCell 
                      key={col.field}
                      sx={{ 
                        minWidth: col.minWidth || 'auto',
                        width: col.width || 'auto'
                      }}
                    >
                      {renderCellContent(row, col)}
                    </TableCell>
                  ))}
                  
                  {/* Actions cell */}
                  {(actions.length > 0 || renderActions) && (
                    <TableCell 
                      align="center"
                      sx={{ 
                        minWidth: 100,
                        width: 100
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {/* Custom render actions */}
                        {renderActions && renderActions(row)}
                        
                        {/* Default actions */}
                        {!renderActions && actions.map((action, actionIndex) => {
                          if (action.icon === 'view' && action.onView) {
                            return (
                              <Tooltip key={actionIndex} title="View">
                                <IconButton 
                                  size="small" 
                                  color="info" 
                                  onClick={() => action.onView(row)}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            );
                          }
                          
                          if (action.icon === 'edit' && action.onEdit) {
                            return (
                              <Tooltip key={actionIndex} title="Edit">
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => action.onEdit(row)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            );
                          }
                          
                          if (action.icon === 'delete' && action.onDelete) {
                            return (
                              <Tooltip key={actionIndex} title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => action.onDelete(row)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            );
                          }
                          
                          if (action.icon === 'more' && action.onMore) {
                            return (
                              <Tooltip key={actionIndex} title="More actions">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onMore(e, row);
                                  }}
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            );
                          }
                          
                          return null;
                        })}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={safeColumns.length + ((actions.length > 0 || renderActions) ? 1 : 0)} 
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No matching records found' : 'No data available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination - Only if enabled */}
      {pagination && (
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { 
            setRowsPerPage(+e.target.value); 
            setPage(0); 
          }}
        />
      )}
    </Paper>
  );
};

export default CommonTable;