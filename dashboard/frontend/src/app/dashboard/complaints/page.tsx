'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Flag, Calendar, ChevronDown, ChevronUp, Filter, TrendingUp, FileText, MapPin, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format, parse } from 'date-fns';
import { complaintData } from '@/lib/complaints-data';
import { weeklyComplaintsData } from '@/lib/data-loader';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define available date ranges for complaints
const complaintsDateRanges = {
  sep28_nov30: {
    label: 'Sep 28 - Nov 30',
    dateRange: '9/28/25 - 11/30/25',
    startDate: '2025-09-28',
    endDate: '2025-11-30'
  }
};

export default function ComplaintsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<string>('sep28_nov30');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Get current date range info
  const currentDateRangeInfo = complaintsDateRanges[selectedDateRange as keyof typeof complaintsDateRanges];

  // Prepare weekly chart data
  const weeklyChartData = weeklyComplaintsData.map(item => {
    const date = new Date(item.date);
    return {
      week: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: item.complaint_count,
      score: Math.round(100 - item.weekly_score_0_100),
      date: item.date
    };
  });

  const latestWeeklyCount = weeklyComplaintsData[weeklyComplaintsData.length - 1].complaint_count;
  const avgWeeklyCount = Math.round(
    weeklyComplaintsData.reduce((sum, item) => sum + item.complaint_count, 0) / weeklyComplaintsData.length
  );

  // Get unique products and states
  const products = useMemo(() => {
    const uniqueProducts = Array.from(new Set(complaintData.map(c => c.product)));
    return uniqueProducts.sort();
  }, []);

  const states = useMemo(() => {
    const uniqueStates = Array.from(new Set(complaintData.map(c => c.state).filter(s => s)));
    return uniqueStates.sort();
  }, []);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaintData.filter(complaint => {
      const productMatch = selectedProduct === 'all' || complaint.product === selectedProduct;
      const stateMatch = selectedState === 'all' || complaint.state === selectedState;
      return productMatch && stateMatch;
    });
  }, [selectedProduct, selectedState]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedProduct, selectedState]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredComplaints.length;
    const byProduct = filteredComplaints.reduce((acc, c) => {
      acc[c.product] = (acc[c.product] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = filteredComplaints.reduce((acc, c) => {
      acc[c.response_to_consumer] = (acc[c.response_to_consumer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProduct = Object.entries(byProduct).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      topProduct: topProduct ? topProduct[0] : 'N/A',
      topProductCount: topProduct ? topProduct[1] : 0,
      closedCount: byStatus['Closed with explanation'] || 0,
      inProgressCount: byStatus['In progress'] || 0,
    };
  }, [filteredComplaints]);

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const parsed = parse(dateStr, 'MM/dd/yy', new Date());
      return format(parsed, 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed with explanation':
        return 'bg-[#6B8E7F]/10 text-[#6B8E7F] border-[#6B8E7F]/30';
      case 'In progress':
        return 'bg-[#C9A66B]/10 text-[#C9A66B] border-[#C9A66B]/30';
      case 'Closed with monetary relief':
        return 'bg-[#3C8825]/10 text-[#3C8825] border-[#3C8825]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSubmittedViaColor = (via: string) => {
    switch (via) {
      case 'Web':
        return 'bg-[#6B8E7F]/10 text-[#6B8E7F] border-[#6B8E7F]/30';
      case 'Referral':
        return 'bg-[#C9A66B]/10 text-[#C9A66B] border-[#C9A66B]/30';
      case 'Phone':
        return 'bg-[#B85C4F]/10 text-[#B85C4F] border-[#B85C4F]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Complaints</h1>
          <p className="text-gray-600 mt-2">
            Browse and analyze customer complaints from CFPB database
          </p>
        </div>
        <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
          <SelectTrigger className="w-64 border-[#D4C4B0]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(complaintsDateRanges).map(([key, range]) => (
              <SelectItem key={key} value={key}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weekly Complaints Trend Chart */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-[#B85C4F] flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>CFPB Complaints</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Weekly volume ({currentDateRangeInfo.dateRange})</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: '#6B7280', fontSize: 12 }} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B7280', fontSize: 12 }} label={{ value: 'Health Score', angle: 90, position: 'insideRight' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#B85C4F" name="Complaint Count" />
              <Line yAxisId="right" type="monotone" dataKey="score" stroke="#3C8825" strokeWidth={2} name="Health Score" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Latest Week</div>
              <div className="text-2xl font-bold text-[#B85C4F]">{latestWeeklyCount}</div>
              <div className="text-xs text-gray-500">complaints</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Weekly Average</div>
              <div className="text-2xl font-bold text-[#C9A66B]">{avgWeeklyCount}</div>
              <div className="text-xs text-gray-500">complaints</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Divider */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Individual Complaints Browser</h2>
        <p className="text-gray-600 mb-6">Filter and explore detailed complaint records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Complaints</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#B85C4F] flex items-center justify-center">
                <Flag className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#B85C4F]">{stats.total}</div>
            <p className="text-sm text-gray-600 mt-1">From CSV data</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Category</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-[#C9A66B] line-clamp-1" title={stats.topProduct}>
              {stats.topProduct.substring(0, 20)}...
            </div>
            <p className="text-sm text-gray-600 mt-1">{stats.topProductCount} complaints</p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Closed Cases</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#6B8E7F] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#6B8E7F]">{stats.closedCount}</div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round((stats.closedCount / stats.total) * 100)}% resolved
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#D4C4B0]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-[#C9A66B] flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#C9A66B]">{stats.inProgressCount}</div>
            <p className="text-sm text-gray-600 mt-1">Pending resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="border border-[#D4C4B0] py-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Product Type
                </label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="border-[#D4C4B0]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products ({complaintData.length})</SelectItem>
                    {products.map(product => (
                      <SelectItem key={product} value={product}>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm truncate max-w-md">
                            {product}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  State
                </label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="border-[#D4C4B0]">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States ({complaintData.length})</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Per Page
              </label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-24 border-[#D4C4B0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card className="border border-[#D4C4B0]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#222222]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flag className="h-5 w-5" />
                <span>Complaint Details</span>
              </div>
              <div className="text-sm font-normal text-gray-500">
                {filteredComplaints.length} complaints
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Flag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No complaints found for this filter</p>
            </div>
          ) : (
            paginatedComplaints.map((complaint, index) => {
              const isExpanded = expandedIds.has(complaint.complaint_id);

              return (
                <div key={complaint.complaint_id}>
                  <div className="border border-[#D4C4B0] rounded-lg overflow-hidden bg-[#F5F3EE]/30">
                    <button
                      onClick={() => toggleExpanded(complaint.complaint_id)}
                      className="w-full p-4 text-left hover:bg-[#F5F3EE]/50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Flag className="h-5 w-5 text-[#B85C4F]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2 gap-4">
                            <div className="flex items-center space-x-2 flex-wrap gap-2">
                              <Badge className={getStatusColor(complaint.response_to_consumer)}>
                                {complaint.response_to_consumer}
                              </Badge>
                              <Badge className={getSubmittedViaColor(complaint.submitted_via)}>
                                {complaint.submitted_via}
                              </Badge>
                              {complaint.state && (
                                <Badge variant="outline" className="border-[#D4C4B0] text-gray-700">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {complaint.state}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 flex-shrink-0">
                              <div className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(complaint.date_received)}
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {complaint.product}
                            </p>
                            <p className="text-sm text-gray-700">
                              {complaint.issue}
                            </p>
                            {complaint.sub_issue && (
                              <p className="text-sm text-gray-600 mt-1">
                                {complaint.sub_issue}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 bg-white border-t border-[#D4C4B0] space-y-3">
                        {complaint.narrative && (
                          <>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Consumer Narrative:</p>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {complaint.narrative}
                              </p>
                            </div>
                            <Separator className="bg-[#D4C4B0]" />
                          </>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Complaint ID:</span>
                            <p className="text-gray-600 mt-1">{complaint.complaint_id}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Sub-Product:</span>
                            <p className="text-gray-600 mt-1">{complaint.sub_product || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date Sent:</span>
                            <p className="text-gray-600 mt-1">{formatDate(complaint.date_sent)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">ZIP Code:</span>
                            <p className="text-gray-600 mt-1">{complaint.zip_code || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Timely Response:</span>
                            <p className="text-gray-600 mt-1">{complaint.timely_response}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Consumer Disputed:</span>
                            <p className="text-gray-600 mt-1">{complaint.consumer_disputed}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {index < filteredComplaints.length - 1 && (
                    <div className="my-3" />
                  )}
                </div>
              );
            })
          )}

          {/* Pagination Controls */}
          {filteredComplaints.length > 0 && totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-[#D4C4B0]">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredComplaints.length)} of{' '}
                  {filteredComplaints.length} complaints
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-[#D4C4B0] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-[#3C8825] hover:bg-[#3C8825]/90 text-white border-[#3C8825]"
                              : "border-[#D4C4B0] hover:bg-[#F5F3EE]"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-[#D4C4B0] disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
