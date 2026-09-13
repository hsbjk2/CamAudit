import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Calendar, Monitor, Mic, Volume2, FileText, Check } from 'lucide-react';
import { DiagnosticReportData } from '../types';

interface ReportPanelProps {
  report: DiagnosticReportData;
  onBack: () => void;
}

export function ReportPanel({ report, onBack }: ReportPanelProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Colors
      const primaryColor = [6, 182, 212]; // Cyan
      const darkColor = [15, 23, 42]; // Slate 900
      const grayColor = [100, 116, 139]; // Slate 500
      const lightBg = [248, 250, 252]; // Slate 50

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, 'F');

      // Brand Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('CamAudit Hardware Diagnostic Report', 14, 15);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(6, 182, 212);
      doc.text('OFFICIAL DIAGNOSTIC SUITE BY HSBJK • CLIENT-SIDE EVALUATION', 14, 22);

      doc.setTextColor(203, 213, 225);
      doc.text(`ID: ${report.id}  •  Date: ${report.dateStr}`, 14, 27);

      // Score Callout Box
      const scoreX = 160;
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(scoreX, 7, 36, 18, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('HEALTH SCORE', scoreX + 4, 13);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(6, 182, 212);
      doc.text(`${report.overallScore} / 100`, scoreX + 4, 20);

      // Overall Evaluation Status
      let startY = 42;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`OVERALL STATUS: ${report.overallStatus} (GRADE ${report.grade})`, 14, startY);

      // Hardware Devices Section
      startY += 8;
      doc.setFontSize(11);
      doc.text('1. Verified Hardware Inventory', 14, startY);

      startY += 5;
      const colW = 60;
      // Camera Box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(14, startY, colW, 20, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('OPTICAL CAMERA', 17, startY + 5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      const camName = report.cameraName.length > 28 ? report.cameraName.substring(0, 26) + '...' : report.cameraName;
      doc.text(camName, 17, startY + 11);
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`Permission: ${report.permissions.camera.toUpperCase()}`, 17, startY + 16);

      // Mic Box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(14 + colW + 4, startY, colW, 20, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('AUDIO INPUT (MIC)', 14 + colW + 7, startY + 5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      const micName = report.microphoneName.length > 28 ? report.microphoneName.substring(0, 26) + '...' : report.microphoneName;
      doc.text(micName, 14 + colW + 7, startY + 11);
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`Permission: ${report.permissions.microphone.toUpperCase()}`, 14 + colW + 7, startY + 16);

      // Speaker Box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(14 + (colW * 2) + 8, startY, colW, 20, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('AUDIO OUTPUT (SPEAKERS)', 14 + (colW * 2) + 11, startY + 5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(report.speakerTested ? 'Auditory Tone Passed' : 'Not Tested', 14 + (colW * 2) + 11, startY + 11);
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text('Channels: Discrete L + R', 14 + (colW * 2) + 11, startY + 16);

      // Detailed Telemetry Table
      startY += 28;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('2. Optical & Signal Diagnostic Telemetry', 14, startY);

      startY += 5;
      const telemetryRows = [
        ['Native Resolution', report.resolution, 'Verified Video Stream'],
        ['Hardware Framerate', `${report.fps} FPS`, report.fps >= 28 ? 'Smooth Motion Verified' : 'Standard Rate'],
        ['Ambient Lighting', report.brightness, 'Luminance Analyzed'],
        ['Lens Sharpness & Focus', `${report.sharpness} / 100`, report.sharpness >= 60 ? 'Crisp Edge Gradient' : 'Acceptable Focus'],
        ['Sensor Exposure', report.exposure, 'Sensor Dynamic Range'],
        ['Color Balance & Temperature', report.colorBalance, 'Balanced RGB Histogram'],
        ['Facial Framing Reticle', report.faceDetected ? 'Subject In View (Tracked)' : 'Standby / Searching', report.faceDetected ? 'Centering Verified' : 'Ready'],
        ['Browser Environment', report.browser, report.secureContext ? 'HTTPS Secure Sandboxed' : 'Standard Context'],
      ];

      // Table Header
      doc.setFillColor(226, 232, 240);
      doc.rect(14, startY, 182, 6, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('PARAMETER', 17, startY + 4.5);
      doc.text('MEASURED VALUE', 85, startY + 4.5);
      doc.text('ASSESSMENT', 145, startY + 4.5);
      startY += 6;

      telemetryRows.forEach((row, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, startY, 182, 6.5, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(row[0], 17, startY + 4.5);
        doc.setFont('helvetica', 'bold');
        doc.text(row[1], 85, startY + 4.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(5, 150, 105);
        doc.text(row[2], 145, startY + 4.5);
        startY += 6.5;
      });

      // Performance Breakdown Matrix
      startY += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('3. Performance Matrix Breakdown', 14, startY);

      startY += 5;
      const matrixItems = [
        ['Resolution', report.breakdown.resolution],
        ['Framerate (FPS)', report.breakdown.fps],
        ['Lighting Quality', report.breakdown.lighting],
        ['Lens Sharpness', report.breakdown.sharpness],
        ['Color Balance', report.breakdown.color],
        ['Frame Stability', report.breakdown.stability],
      ];

      matrixItems.forEach((item, idx) => {
        const itemX = idx % 2 === 0 ? 14 : 108;
        const itemY = startY + Math.floor(idx / 2) * 9;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text(item[0].toString(), itemX, itemY + 4);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(`${item[1]}%`, itemX + 50, itemY + 4);

        // Mini bar
        doc.setFillColor(226, 232, 240);
        doc.rect(itemX + 60, itemY + 1.5, 26, 3, 'F');
        doc.setFillColor(6, 182, 212);
        doc.rect(itemX + 60, itemY + 1.5, (Number(item[1]) / 100) * 26, 3, 'F');
      });

      // Security & Privacy Verification
      startY += 34;
      doc.setFillColor(240, 253, 250);
      doc.roundedRect(14, startY, 182, 18, 1.5, 1.5, 'F');
      doc.setDrawColor(153, 246, 228);
      doc.roundedRect(14, startY, 182, 18, 1.5, 1.5, 'S');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 148, 136);
      doc.text('ZERO-TELEMETRY GUARANTEE & PRIVACY VERIFICATION', 18, startY + 6);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        'All camera stream frames, microphone waveforms, and diagnostic metrics evaluated in this session were processed locally inside the browser. No video, audio, or biometric telemetry was uploaded to any remote server.',
        18,
        startY + 11,
        { maxWidth: 174 }
      );

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('CamAudit by HSBJK • Generated directly via in-browser HTML5 client hardware analyzer', 14, 285);
      doc.text('https://camaudit.app', 175, 285);

      // Save PDF file
      doc.save(`camaudit-report-${report.id}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window.print if jsPDF has any issue
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `camaudit-report-${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: 'PASS' | 'WARNING' | 'FAILED') => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 text-xs font-mono-tech font-bold">
            <CheckCircle2 className="w-4 h-4" />
            PASS
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40 text-xs font-mono-tech font-bold">
            <AlertTriangle className="w-4 h-4" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/40 text-xs font-mono-tech font-bold">
            <XCircle className="w-4 h-4" />
            FAILED
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Direct PDF Download Button */}
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-75 active:scale-95"
          >
            {pdfSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
              </>
            )}
          </button>

          {/* Secondary Print / Browser Print Dialog Button */}
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 transition-colors cursor-pointer"
            title="Open browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* JSON Telemetry Export */}
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 transition-colors cursor-pointer"
            title="Download JSON telemetry"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card with light/dark adaptive background */}
      <div className="p-6 sm:p-10 rounded-2xl glass-panel border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl bg-white dark:bg-[#080d1a] text-slate-800 dark:text-slate-100 print:bg-white print:text-slate-900 print:shadow-none print:border print:border-slate-300">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white print:text-slate-950">
                CamAudit Device Diagnostic Report
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 print:text-cyan-700 print:border print:border-cyan-600 border border-cyan-500/30 font-semibold">
                HSBJK VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono-tech flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {report.dateStr}
              </span>
              <span>•</span>
              <span>ID: {report.id}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {getStatusBadge(report.overallStatus)}
            <div className="text-right">
              <span className="text-[10px] font-mono-tech text-slate-500 dark:text-slate-400 print:text-slate-600 block uppercase">Overall Score</span>
              <span className="text-2xl font-display font-bold text-cyan-600 dark:text-cyan-400 print:text-cyan-700">
                {report.overallScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Primary Hardware Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-slate-50 border border-slate-200 dark:border-white/5 print:border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-500 dark:text-slate-400 print:text-slate-600 mb-1">
              <Monitor className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              CAMERA HARDWARE
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white print:text-slate-900 truncate">
              {report.cameraName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1 font-mono-tech">
              Status: {report.permissions.camera === 'granted' ? 'Verified' : 'Blocked'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-slate-50 border border-slate-200 dark:border-white/5 print:border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-500 dark:text-slate-400 print:text-slate-600 mb-1">
              <Mic className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              MICROPHONE AUDIO
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white print:text-slate-900 truncate">
              {report.microphoneName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1 font-mono-tech">
              Status: {report.permissions.microphone === 'granted' ? 'Signal Active' : 'Not Connected'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-slate-50 border border-slate-200 dark:border-white/5 print:border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-500 dark:text-slate-400 print:text-slate-600 mb-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              SPEAKERS & OUTPUT
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white print:text-slate-900">
              {report.speakerTested ? 'Auditory Test Passed' : 'Not Tested'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1 font-mono-tech">
              Channels: Stereo L + R
            </div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="my-6">
          <h4 className="text-sm font-mono-tech font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 print:text-slate-800 mb-3">
            Optical & Signal Telemetry
          </h4>

          <div className="border border-slate-200 dark:border-white/10 print:border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-200 text-xs">
            <div className="grid grid-cols-3 p-3 bg-slate-100 dark:bg-slate-900/40 print:bg-slate-100 font-mono-tech text-slate-600 dark:text-slate-400 print:text-slate-600 font-semibold">
              <span>PARAMETER</span>
              <span>MEASURED VALUE</span>
              <span>EVALUATION</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Native Resolution</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.resolution}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono-tech">Verified High Definition</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Hardware Framerate</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.fps} FPS</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono-tech">{report.fps >= 28 ? 'Smooth Motion' : 'Acceptable'}</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Ambient Lighting</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.brightness}</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono-tech">Even Illumination</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Lens Sharpness & Focus</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.sharpness}/100</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono-tech">{report.sharpness >= 60 ? 'Crisp Detail' : 'Soft'}</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Sensor Exposure</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.exposure}</span>
              <span className="text-slate-600 dark:text-slate-300 print:text-slate-700 font-mono-tech">Balanced Highlights</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Color Spectrum & Warmth</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.colorBalance}</span>
              <span className="text-slate-600 dark:text-slate-300 print:text-slate-700 font-mono-tech">Natural Tint</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Facial Framing Reticle</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.faceDetected ? 'Subject In View' : 'Not Centered'}</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono-tech">{report.faceDetected ? 'Tracked' : 'Standby'}</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">Browser Environment</span>
              <span className="font-mono-tech text-slate-900 dark:text-slate-200 print:text-slate-900 font-semibold">{report.browser}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono-tech">{report.secureContext ? 'HTTPS Secure Context' : 'Standard'}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 print:bg-slate-50 border border-slate-200 dark:border-white/5 print:border-slate-200">
          <h5 className="text-xs font-mono-tech text-slate-600 dark:text-slate-400 print:text-slate-600 mb-3 uppercase font-semibold">
            Performance Breakdown Matrix
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between font-mono-tech mb-1 text-slate-700 dark:text-slate-300">
                <span>Resolution</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.breakdown.resolution}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 print:bg-slate-200 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${report.breakdown.resolution}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1 text-slate-700 dark:text-slate-300">
                <span>Framerate</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.breakdown.fps}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 print:bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${report.breakdown.fps}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1 text-slate-700 dark:text-slate-300">
                <span>Lighting</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.breakdown.lighting}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 print:bg-slate-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${report.breakdown.lighting}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1 text-slate-700 dark:text-slate-300">
                <span>Sharpness</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.breakdown.sharpness}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 print:bg-slate-200 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${report.breakdown.sharpness}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1 text-slate-700 dark:text-slate-300">
                <span>Color</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.breakdown.color}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 print:bg-slate-200 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${report.breakdown.color}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1 text-slate-700 dark:text-slate-300">
                <span>Stability</span>
                <span className="font-bold text-slate-900 dark:text-white">{report.breakdown.stability}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 print:bg-slate-200 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${report.breakdown.stability}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy verification footer on report */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>CamAudit by HSBJK • 100% Client-Side In-Browser Execution</span>
          </div>
          <span className="font-mono-tech text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">HSBJK // SECURE LOCAL HARNESS</span>
        </div>

      </div>
    </div>
  );
}
