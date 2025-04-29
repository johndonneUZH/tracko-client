"use client";

import { Button } from "@components/commons/button";
import { Download } from "lucide-react";
import { ApiService } from "@/api/apiService";
import { useState } from "react";
import { toast } from "sonner";
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
    },
    section: {
      marginBottom: 20,
    },
    h2: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    h4: {
      fontSize: 14,
      marginBottom: 6,
      fontWeight: 'bold',
    },
    p: {
      fontSize: 12,
      marginBottom: 8,
      lineHeight: 1.5,
    },
    ul: {
      marginLeft: 20,
      marginBottom: 8,
    },
    li: {
      fontSize: 12,
      marginBottom: 4,
      lineHeight: 1.5, 
    },
    strong: {
      fontWeight: 'bold',
    }
  });
  
  const parseHtmlToPdf = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let nodeId = 0;
  
    const parseNode = (node: ChildNode): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text ? <Text key={`text-${nodeId++}`}>{text}</Text> : null;
      }
  
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();
        const children = Array.from(node.childNodes).map(parseNode).filter(Boolean);
        const key = `node-${nodeId++}`;
  
        switch (tagName) {
          case 'h2':
            return <Text key={key} style={styles.h2}>{children}</Text>;
          case 'h3':
            return <Text key={key} style={styles.h3}>{children}</Text>;
          case 'h4':
            return <Text key={key} style={styles.h4}>{children}</Text>;
          case 'p':
            return <Text key={key} style={styles.p}>{children}</Text>;
          case 'ul':
            return <View key={key} style={styles.ul}>{children}</View>;
          case 'li':
            return <Text key={key} style={styles.li}>• {children}</Text>; 
          case 'strong':
            return <Text key={key} style={styles.strong}>{children}</Text>;
          default:
            return <Text key={key}>{children}</Text>;
        }
      }
  
      return null;
    };
  
    return Array.from(tempDiv.childNodes).map(parseNode).filter(Boolean);
  };
  

const MyDocument = ({ content }: { content: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>{parseHtmlToPdf(content)}</View>
    </Page>
  </Document>
);

export default function NewReportButton({ projectId }: { projectId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const apiService = new ApiService();
      const response = await apiService.get(`/projects/${projectId}/report`);
      if (!response?.text) throw new Error("Report content is empty");

      const fileName = `Project_Report_${projectId}_${new Date().toISOString().split("T")[0]}.pdf`;
      const blob = await pdf(<MyDocument content={response.text} />).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success("Report downloaded successfully");
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        className="p-3 text-white rounded-lg shadow-lg"
        onClick={fetchReport}
        disabled={isLoading}
      >
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? "Generating..." : "Generate Report"}
      </Button>
    </div>
  );
}
