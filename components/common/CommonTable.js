import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  RestoreFromTrash,
} from '@mui/icons-material';

const CommonTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  onRestore,
  onRowSelect,
  selectedRows = [],
  selectable = false,
  searchable = true,
  pagination = true,
  actions = ['view', 'edit', 'delete'],
  showSoftDelete = false,
}) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [actionMenu, setActionMenu] = useState({ anchor: null, row: null });

  // 🔍 Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm) return safeData;

    return safeData.filter((row) =>
      safeColumns.some((col) => {
        const value = row[col.field];
        return (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [safeData, searchTerm, safeColumns]);

  // ↕️ Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === undefined || bValue === undefined) return 0;

      if (order === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
  }, [filteredData, orderBy, order]);

  // 📄 Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, pagination]);

  // Handlers
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      onRowSelect?.(paginatedData.map((row) => row.id));
    } else {
      onRowSelect?.([]);
    }
  };

  const handleSelectRow = (rowId) => {
    const selectedIndex = selectedRows.indexOf(rowId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, rowId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    onRowSelect?.(newSelected);
  };

  const handleActionMenuOpen = (event, row) => {
    setActionMenu({ anchor: event.currentTarget, row });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchor: null, row: null });
  };

  const renderCellContent = (row, column) => {
    const value = row[column.field];

    if (column.render) {
      try {
        return column.render(value, row);
      } catch (err) {
        console.error(`Error rendering column "${column.field}":`, err);
        return '-';
      }
    }

    if (column.type === 'chip') {
      // ✅ CORRECTED: Handle chipColor function properly
      let chipColor = 'default';

      if (typeof column.chipColor === 'function') {
        // If it's a function, call it with the value
        chipColor = column.chipColor(value) || 'default';
      } else if (typeof column.chipColor === 'string') {
        // If it's a string, use it directly
        chipColor = column.chipColor;
      }

      return (
        <Chip
          label={value || '-'}
          color={chipColor}
          size="small"
          variant="outlined"
        />
      );
    }

    if (column.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return value ?? '-';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* 🔍 Search */}
      {searchable && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value?.trimStart())}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* 🧾 Table */}
      <TableContainer>
        <Table stickyHeader aria-label="common table">
          <TableHead>
            <TableRow>
              {/* Select All */}
              {selectable && (
                <TableCell padding="checkbox" sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < paginatedData.length
                    }
                    checked={
                      paginatedData.length > 0 &&
                      selectedRows.length === paginatedData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {/* Columns */}
              {safeColumns.map((column) => (
                <TableCell
                  key={column.field}
                  sortDirection={orderBy === column.field ? order : false}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: 'bold',
                    backgroundColor: 'background.paper',
                    fontSize: '0.9rem',
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleSort(column.field)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {column.headerName}
                    </Typography>
                  )}
                </TableCell>
              ))}

              {(actions.length > 0 || selectable) && (
                <TableCell
                  align="right"
                  sx={{
                    width: 100,
                    fontWeight: 'bold',
                    backgroundColor: 'background.paper',
                    fontSize: '0.9rem',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id || Math.random()}
                  hover
                  selected={selectedRows.indexOf(row.id) !== -1}
                  sx={{
                    opacity: row.isDeleted ? 0.6 : 1,
                    backgroundColor: row.isDeleted ? 'action.hover' : 'inherit',
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.indexOf(row.id) !== -1}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </TableCell>
                  )}

                  {safeColumns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCellContent(row, column)}
                    </TableCell>
                  ))}

                  {(actions.length > 0 || selectable) && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {actions.includes('view') && onView && (
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => onView(row)} color="info">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        )}

                        {actions.includes('edit') && onEdit && !row.isDeleted && (
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}

                        {actions.includes('delete') && (
                          showSoftDelete && row.isDeleted ? (
                            onRestore && (
                              <Tooltip title="Restore">
                                <IconButton
                                  size="small"
                                  onClick={() => onRestore(row)}
                                  color="success"
                                >
                                  <RestoreFromTrash />
                                </IconButton>
                              </Tooltip>
                            )
                          ) : (
                            onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(row)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            )
                          )
                        )}

                        {actions.includes('more') && (
                          <>
                            <Tooltip title="More actions">
                              <IconButton
                                size="small"
                                onClick={(e) => handleActionMenuOpen(e, row)}
                              >
                                <MoreVert />
                              </IconButton>
                            </Tooltip>

                            <Menu
                              anchorEl={actionMenu.anchor}
                              open={Boolean(actionMenu.anchor && actionMenu.row?.id === row.id)}
                              onClose={handleActionMenuClose}
                            >
                              <MenuItem
                                onClick={() => {
                                  onView?.(row);
                                  handleActionMenuClose();
                                }}
                              >
                                View Details
                              </MenuItem>
                              {!row.isDeleted && (
                                <MenuItem
                                  onClick={() => {
                                    onEdit?.(row);
                                    handleActionMenuClose();
                                  }}
                                >
                                  Edit
                                </MenuItem>
                              )}
                              {row.isDeleted ? (
                                <MenuItem
                                  onClick={() => {
                                    onRestore?.(row);
                                    handleActionMenuClose();
                                  }}
                                >
                                  Restore
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={() => {
                                    onDelete?.(row);
                                    handleActionMenuClose();
                                  }}
                                >
                                  Delete
                                </MenuItem>
                              )}
                            </Menu>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    safeColumns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)
                  }
                  align="center"
                >
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default CommonTable;