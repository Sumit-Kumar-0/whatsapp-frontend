import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TableSortLabel, Paper,
  TextField, IconButton, Tooltip, Box, Typography, InputAdornment
} from '@mui/material';
import { Search, Edit, Delete, Visibility } from '@mui/icons-material';

const CommonTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  searchable = true,
  pagination = true,
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
      safeColumns.some(col =>
        row[col.field]?.toString().toLowerCase().includes(term)
      )
    );
  }, [safeData, searchTerm, safeColumns]);

  // ↕️ Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal == null || bVal == null) return 0;
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

  // ✂️ Truncate text with tooltip
  const renderText = (value, max = 30) => {
    if (value == null) return '-';
    const text = String(value);
    const truncated = text.length > max ? text.slice(0, max) + '…' : text;
    return (
      <Tooltip title={text.length > max ? text : ''} placement="top" arrow>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 250,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: text.length > max ? 'help' : 'default',
          }}
        >
          {truncated}
        </Typography>
      </Tooltip>
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* 🔍 Search box */}
      {searchable && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search..."
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
                  sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : 'asc'}
                      onClick={() => {
                        setOrder(orderBy === col.field && order === 'asc' ? 'desc' : 'asc');
                        setOrderBy(col.field);
                      }}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <TableRow key={row._id || row.id} hover>
                  {safeColumns.map(col => (
                    <TableCell key={col.field}>
                      {renderText(row[col.field])}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {onView && (
                        <Tooltip title="View">
                          <IconButton size="small" color="info" onClick={() => onView(row)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={safeColumns.length + 1} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
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
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        />
      )}
    </Paper>
  );
};

export default CommonTable;
