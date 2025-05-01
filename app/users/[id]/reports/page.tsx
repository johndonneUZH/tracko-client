/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ApiService } from "@/api/apiService";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/commons/breadcrumb";
import { Button } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/sidebar/sidebar";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPdf } from "@components/dashboard_Project/NewReport";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Report {
    reportId: string;
    reportName: string;
    userId: string;
    reportContent: string;
    createdAt: string;
}

export default function ReportsPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState("");
    
    // Create apiService instance with useMemo to prevent recreation on every render
    const apiService = useMemo(() => new ApiService(), []);

    const handleDownload = async (reportId: string) => {   
        try {
            const response = await apiService.get<Report>(`/users/${userId}/reports/${reportId}`)
            const content = response.reportContent;
            createPdf(content, reportId, response.reportName); 
            setError(null);
            toast.success("Report downloaded successfully!");
        } catch (err: any) {
            console.error("Failed to download report:", err);
            setError(err.message || "Failed to download report.");
        }
    }

    const handleEdit = async (reportId: string) => {
      console.log(`Editing report ${reportId} with new name: ${editedName}`);
      
      try {
          await apiService.put(
              `/users/${userId}/reports/${reportId}`, 
              { reportContent: editedName }  
          );
  
          // Optimistically update the local state
          setReports(reports.map(report => 
              report.reportId === reportId 
                  ? { ...report, reportName: editedName } 
                  : report
          ));
  
          setEditingReportId(null);
          setEditedName("");
          setError(null);
      } catch (err: any) {
          console.error("Failed to update report:", err);
          setError(err.message || "Failed to update report.");
      }
      fetchReports(); 
  };

    const startEditing = (report: Report) => {
        setEditingReportId(report.reportId);
        setEditedName(report.reportName);
    };

    const cancelEditing = () => {
        setEditingReportId(null);
        setEditedName("");
    };

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedToken = sessionStorage.getItem("token");
    
        if (!storedUserId || !storedToken) {
            router.push("/login");
            return;
        }
    
        setUserId(storedUserId);
        setToken(storedToken);
    }, [router]);
    
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
          const response = await apiService.get<Report[]>(`/users/${userId}/reports`);
          setReports(response);
      } catch (err: any) {
          console.error("Failed to fetch reports:", err);
          setError(err.message || "Failed to fetch reports.");
      } finally {
          setLoading(false);
      }
  }
    useEffect(() => {
        if (!userId || !token) return;

        fetchReports();
    }, [userId, token]); // Removed apiService from dependencies since it's now memoized

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <AppSidebar className="w-64 shrink-0" />
        
                {/* Main Content Wrapper */}
                <div className="flex flex-col flex-1">
                    {/* Fixed Header with Breadcrumb */}
                    <header className="flex h-16 items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 mr-2" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Reports</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>

                    {/* Main Content Area */}
                    <div className="flex-1 p-4">
   
                    {!loading && !error && reports.length > 0 && (
                    <ul className="space-y-4">
                        {reports.map((report) => (
                            <li key={report.reportId} className="border p-4 rounded-md shadow-sm">
                                {editingReportId === report.reportId ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleEdit(report.reportId)}
                                        >
                                            Save
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">{report.reportName}</h2>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDownload(report.reportId)}
                                                className="text-muted-foreground hover:text-primary"
                                            >
                                                Download
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => startEditing(report)}
                                                className="text-muted-foreground hover:text-primary"
                                            >
                                                <Pencil className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}