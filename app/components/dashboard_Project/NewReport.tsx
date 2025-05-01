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
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#333',
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 24,
  },
  h2: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'semibold',
    color: '#111827',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 8,
  },
  h3: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'semibold',
    color: '#1f2937',
  },
  h4: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'semibold',
    color: '#374151',
  },
  p: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 1.6,
  },
  ul: {
    marginLeft: 24,
    marginBottom: 12,
  },
  li: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 1.6,
  },
  strong: {
    fontWeight: 'semibold',
  },
  prosConsContainer: {
    marginLeft: 16,
    marginBottom: 12,
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: 'semibold',
    marginBottom: 4,
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
          return <View key={key} style={{flexDirection: 'row'}}>
            <Text>• </Text>
            <Text style={styles.li}>{children}</Text>
          </View>;
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

      const fileName = `Project_${projectId}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      const blob = await pdf(<MyDocument content={response.text} />).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

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
        className="bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors shadow-sm"
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
      <p className="mt-2 text-sm text-gray-500">
        PDF format with professional styling
      </p>
    </div>
  );
}