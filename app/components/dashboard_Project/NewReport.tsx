/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Button } from "@components/commons/button";
import { Download } from "lucide-react";
import { ApiService } from "@/api/apiService";
import { useState } from "react";
import { toast } from "sonner";
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
// Enhanced professional styles
const styles = StyleSheet.create({
  page: {
    padding: 30,  
    fontFamily: 'Helvetica',
    color: '#333',
    lineHeight: 1.4,  
  },
  section: {
    marginBottom: 12,  
    padding: 10  
  },
  h2: {
    fontSize: 14,  
    marginBottom: 8, 
    fontWeight: 'semibold',
    color: '#111827',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 4,  
  },
  h3: {
    fontSize: 13,  
    marginBottom: 6,  
    fontWeight: 'semibold',
    color: '#1f2937',
  },
  h4: {
    fontSize: 11, 
    marginBottom: 4, 
    fontWeight: 'semibold',
    color: '#374151',
  },
  p: {
    fontSize: 10,
    marginBottom: 8, 
    lineHeight: 1.4,
  },
  ul: {
    marginLeft: 12, 
    marginBottom: 8,  
  },
  li: {
    fontSize: 10,
    marginBottom: 4, 
    lineHeight: 1.4, 
    flexDirection: 'row',
    alignItems: 'flex-start',  
  },
  bulletPoint: {
    width: 8,
    paddingRight: 4,  
  },
  liContent: {
    flex: 1,
  },
  strong: {
    fontWeight: 'semibold',
  },
  prosConsContainer: {
    marginLeft: 8,  
    marginBottom: 8, 
  },
  prosConsTitle: {
    fontSize: 11, 
    fontWeight: 'semibold',
    marginBottom: 2,  
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
          return (
            <View key={key} style={styles.li}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.liContent}>{children}</Text>
            </View>
          );
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

export async function createPdf(content: string, projectId: string) {
  const fileName = `Project_${projectId}_Report_${new Date().toISOString().split('T')[0]}_${new Date().toISOString().split('T')[1].slice(0, 5).replace(':', '-')}.pdf`;
  const blob = await pdf(<MyDocument content={content} />).toBlob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export default function NewReportButton({ projectId }: { projectId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const apiService = new ApiService();
      const response = await apiService.get<{ text: string }>(`/projects/${projectId}/report`);
      if (!response?.text) throw new Error("Report content is empty");

      createPdf(response.text, projectId);

      toast.success("Report downloaded successfully");
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <Button
        variant="default"
        size="default"
        className="bp-3 text-white rounded-lg shadow-lg"
        onClick={fetchReport}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          <span className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </span>
        )}
      </Button>
    </div>
  );
}