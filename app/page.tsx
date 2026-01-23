"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Timer,
  Truck,
  Layers,
  Wrench,
  Sparkles,
  Ruler,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  BadgeCheck,
  Package,
  Zap,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { parseFile, type ParseResult } from "@/lib/file-parser";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const materials = [
  {
    title: "Acrylics",
    desc: "Clear, frosted, mirrored, and colored acrylic for signage, displays, guards, and premium retail.",
    icon: Layers,
    tags: ["Laser", "CNC"],
  },
  {
    title: "Plastics",
    desc: "ABS, PETG, HDPE, polycarbonate and more—cut and machined to spec with clean edges.",
    icon: Sparkles,
    tags: ["CNC", "Routing"],
  },
  {
    title: "Wood & Sheet Goods",
    desc: "Hardwoods, MDF, plywood, and specialty sheets—fast, precise cutting for production runs.",
    icon: Package,
    tags: ["Laser", "CNC"],
  },
  {
    title: "Composites",
    desc: "Composite panels and specialty substrates for durable, lightweight components.",
    icon: ShieldCheck,
    tags: ["CNC"],
  },
  {
    title: "Veneer",
    desc: "Premium veneer components and overlays—ideal for retail, packaging, and branded displays.",
    icon: BadgeCheck,
    tags: ["Laser", "Finishing"],
  },
  {
    title: "Assembly Services",
    desc: "Skilled hand assembly for kits, displays, packaging, and multi-part builds—scale from 10–50+ hands fast.",
    icon: Wrench,
    tags: ["Assembly", "Kitting"],
  },
];

// Material options with available thicknesses for the quote form
const materialOptions: Record<string, string[]> = {
  "Baltic Birch": ['0.25"', '0.5"', '0.75"', '1"'],
  "Acrylic": ['1/16"', '1/8"', '1/4"'],
  "MDF": ['0.25"', '0.5"', '0.75"', '1"'],
};

const featureBullets = [
  {
    title: "100% Made in USA",
    desc: "Built in our Minnesota facility with quality controls, repeatability, and fast communication.",
    icon: ShieldCheck,
  },
  {
    title: "2–5 Day Turn Time",
    desc: "Standard production windows designed for speed—rush options available for many parts.",
    icon: Timer,
  },
  {
    title: "Buy One. Plant One.",
    desc: "We plant a tree for every product we make—real impact baked into your supply chain.",
    icon: Leaf,
  },
  {
    title: "Drop Ship or Bulk",
    desc: "Ship direct to customers, stores, or your 3PL—labeled, packed, and ready to hit shelves.",
    icon: Truck,
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="flex items-center justify-center gap-2">
        <Pill>{eyebrow}</Pill>
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function GradientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute left-1/2 top-[-10rem] h-[28rem] w-[56rem] -translate-x-1/2 rounded-full blur-3xl opacity-40" />
      <div className="absolute -left-16 top-32 h-72 w-72 rounded-full blur-3xl opacity-25" />
      <div className="absolute -right-12 bottom-[-4rem] h-80 w-80 rounded-full blur-3xl opacity-25" />
    </div>
  );
}

function TopNav() {
  const links = [
    { label: "Materials", href: "#materials" },
    { label: "How it Works", href: "#how" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "FAQs", href: "#faqs" },
  ];

  return (
    <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">WOODCHUCK USA</div>
            <div className="text-xs text-muted-foreground">
              Custom Cutting + Assembly
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:inline-flex" asChild>
            <a href="#quote">Instant Quote</a>
          </Button>
          <Button className="rounded-2xl" asChild>
            <a href="#">
              <Zap className="mr-2 h-4 w-4 fill-current" /> Click. Cut. Ship.
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedThickness, setSelectedThickness] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseResults, setParseResults] = useState<ParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableThicknesses = selectedMaterial
    ? materialOptions[selectedMaterial] || []
    : [];

  const createSvgPreview = useCallback(async (file: File): Promise<string | null> => {
    try {
      const content = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "image/svg+xml");
      const svg = doc.querySelector("svg");
      if (!svg) return null;

      // Get all visual elements and calculate bounding box
      const elements = svg.querySelectorAll("path, line, circle, ellipse, rect, polyline, polygon");

      // Clone SVG for preview
      const previewSvg = svg.cloneNode(true) as SVGSVGElement;

      // Bold all strokes and ensure visibility
      const allElements = previewSvg.querySelectorAll("*");
      allElements.forEach((el) => {
        if (el instanceof SVGElement) {
          const currentStroke = el.getAttribute("stroke") || window.getComputedStyle(el).stroke;
          const currentFill = el.getAttribute("fill");

          // Set stroke to be visible
          if (currentStroke === "none" || !currentStroke || currentStroke === "") {
            if (currentFill === "none" || !currentFill) {
              el.setAttribute("stroke", "#000000");
            }
          }

          // Bold the stroke
          el.setAttribute("stroke-width", "2");

          // If no fill and no stroke, add stroke
          if ((!currentFill || currentFill === "none") && (!currentStroke || currentStroke === "none")) {
            el.setAttribute("stroke", "#000000");
          }
        }
      });

      // Try to get the bounding box by temporarily adding to DOM
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.width = "1000px";
      tempDiv.style.height = "1000px";
      document.body.appendChild(tempDiv);
      tempDiv.appendChild(previewSvg);

      // Get bbox of all content
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      elements.forEach((_, i) => {
        const previewEl = previewSvg.querySelectorAll("path, line, circle, ellipse, rect, polyline, polygon")[i];
        if (previewEl instanceof SVGGraphicsElement) {
          try {
            const bbox = previewEl.getBBox();
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x + bbox.width);
            maxY = Math.max(maxY, bbox.y + bbox.height);
          } catch {
            // Skip elements that can't get bbox
          }
        }
      });

      document.body.removeChild(tempDiv);

      // Set viewBox to zoom to content with padding
      if (minX !== Infinity) {
        const padding = Math.max((maxX - minX), (maxY - minY)) * 0.1;
        const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
        previewSvg.setAttribute("viewBox", viewBox);
      }

      previewSvg.setAttribute("width", "100%");
      previewSvg.setAttribute("height", "100%");
      previewSvg.style.maxWidth = "100%";
      previewSvg.style.maxHeight = "100%";

      // Convert to data URL
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(previewSvg);
      const dataUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));

      return dataUrl;
    } catch {
      return null;
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setParseError(null);
    setParseResults(null);
    setIsParsing(true);
    setFilePreview(null);

    // Create preview URL for SVG files
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "svg") {
      const preview = await createSvgPreview(file);
      setFilePreview(preview);
    }

    try {
      const results = await parseFile(file);
      setParseResults(results);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setIsParsing(false);
    }
  }, [createSvgPreview]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "svg" && extension !== "dxf") {
      setParseError("Please upload SVG or DXF files only.");
      return;
    }

    setUploadedFile(file);
    setParseError(null);
    setParseResults(null);
    setIsParsing(true);
    setFilePreview(null);

    // Create preview URL for SVG files
    if (extension === "svg") {
      const preview = await createSvgPreview(file);
      setFilePreview(preview);
    }

    try {
      const results = await parseFile(file);
      setParseResults(results);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setIsParsing(false);
    }
  }, [createSvgPreview]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setParseResults(null);
    setParseError(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Cost calculation (example rates - adjust as needed)
  const COST_PER_INCH_CUT = 0.15; // per inch of cut length
  const COST_PER_SQ_INCH_MATERIAL = 0.05; // per square inch of material

  // Check if all required fields are filled
  const allFieldsFilled = selectedMaterial && selectedThickness && quantity && parseResults;
  const parsedQuantity = parseInt(quantity) || 0;

  // Calculate per unit price only when all fields are filled
  const perUnitPrice = allFieldsFilled && parseResults
    ? (parseResults.pathLengthInches * COST_PER_INCH_CUT) +
      (parseResults.areaSquareInches * COST_PER_SQ_INCH_MATERIAL)
    : null;

  return (
    <section className="relative">
      <GradientBackdrop />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full">100% Made in USA</Badge>
            <Badge variant="secondary" className="rounded-full">
              2–5 Day Turn Time
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Buy One. Plant One.
            </Badge>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Upload your files. We cut it. We assemble it. We Ship it.
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Send your DXF / SVG / AI / PDF (or tell us what you need) and
            we&apos;ll produce precision parts in acrylics, plastics, wood,
            composites, and veneer—built fast in the USA.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="rounded-2xl" asChild>
              <a href="#quote">
                Get an Instant Quote <Zap className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl" asChild>
              <a href="#capabilities">See Capabilities</a>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featureBullets.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border bg-background/60 p-3 shadow-sm"
              >
                <f.icon className="h-5 w-5" />
                <div className="mt-2 text-sm font-medium">{f.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="flex items-center"
        >
          <Card className="w-full rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-10 w-10 fill-primary text-primary" />
                Click. Cut. Ship.
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Upload your file, purchase, and we ship. Yes, it&apos;s that easy.
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".svg,.dxf"
                  className="hidden"
                />
                <div
                  className="rounded-2xl border border-dashed p-5 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {!uploadedFile ? (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Drop files here or click to upload</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          SVG, DXF files supported. We&apos;ll calculate cut length and material area instantly.
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill>Laser Cutting</Pill>
                          <Pill>CNC Routing</Pill>
                          <Pill>Finishing</Pill>
                          <Pill>Assembly</Pill>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border bg-primary/10">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{uploadedFile.name}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFile();
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Remove
                          </button>
                        </div>
                        {isParsing && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Analyzing file...
                          </div>
                        )}
                        {parseError && (
                          <div className="mt-2 text-xs text-red-500">
                            {parseError}
                          </div>
                        )}
                        {parseResults && (
                          <div className="mt-3 space-y-3">
                            {filePreview && (
                              <div className="flex justify-center rounded-xl border bg-white p-2">
                                <img
                                  src={filePreview}
                                  alt="File preview"
                                  className="h-16 w-auto object-contain"
                                />
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-xl border bg-background/60 p-3">
                                <div className="text-xs text-muted-foreground">Cut Length</div>
                                <div className="text-lg font-semibold">
                                  {parseResults.pathLengthInches.toFixed(2)}&quot;
                                </div>
                              </div>
                              <div className="rounded-xl border bg-background/60 p-3">
                                <div className="text-xs text-muted-foreground">Material Area</div>
                                <div className="text-lg font-semibold">
                                  {parseResults.areaSquareInches.toFixed(2)} sq&quot;
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Material
                    </div>
                    <Select
                      value={selectedMaterial}
                      onValueChange={(value) => {
                        setSelectedMaterial(value);
                        setSelectedThickness("");
                      }}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(materialOptions).map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Thickness
                    </div>
                    <Select
                      value={selectedThickness}
                      onValueChange={setSelectedThickness}
                      disabled={!selectedMaterial}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue
                          placeholder={
                            selectedMaterial
                              ? "Select thickness"
                              : "Select material first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableThicknesses.map((thickness) => (
                          <SelectItem key={thickness} value={thickness}>
                            {thickness}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Quantity
                    </div>
                    <Input
                      className="rounded-2xl"
                      placeholder="e.g., 25"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      min="1"
                    />
                    <div className="text-xs text-muted-foreground">
                      Discounts applied to larger volumes
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Per Unit Price
                    </div>
                    <div className="rounded-2xl border bg-muted/30 px-4 py-2 h-10 flex items-center">
                      {perUnitPrice !== null ? (
                        <div className="text-lg font-semibold text-primary">
                          ${perUnitPrice.toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          *Fills when all fields selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Turn Time
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select turn time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (2–5 business days)
                      </SelectItem>
                      <SelectItem value="rush">
                        Rush (when available)
                      </SelectItem>
                      <SelectItem value="scheduled">
                        Scheduled / recurring
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full rounded-2xl"
                  size="lg"
                  onClick={() =>
                    alert("Connect this button to your purchase workflow.")
                  }
                >
                  Purchase Parts
                </Button>

                <div className="flex items-start gap-2 rounded-2xl border p-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <div>
                    Every order plants a tree. Want a branded &quot;forest&quot;
                    allocation or reporting for enterprise programs? We can do
                    that.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function Materials() {
  return (
    <section id="materials" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeader
          eyebrow="Materials + Services"
          title="Cut the parts you need—then scale with assembly."
          subtitle="SendCutSend-style simplicity, but built for plastics + wood ecosystems and production kitting."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {materials.map((m) => (
            <motion.div key={m.title} variants={item}>
              <Card className="h-full rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <m.icon className="h-5 w-5" />
                    {m.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="rounded-full">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Upload your files",
      desc: "DXF/SVG/AI/PDF—tell us material + qty. If you're not sure, we'll recommend the best fit.",
      icon: Upload,
    },
    {
      title: "We quote + confirm",
      desc: "Pricing based on geometry, material, and operations. Add finishing or assembly if needed.",
      icon: Ruler,
    },
    {
      title: "We produce in the USA",
      desc: "Laser + CNC routing with QC checks. Typical production 2–5 business days.",
      icon: Timer,
    },
    {
      title: "Ship or drop-ship",
      desc: "Bulk shipments, labeled cartons, or drop-ship direct to customers or stores.",
      icon: Truck,
    },
  ];

  return (
    <section id="how" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeader
          eyebrow="How it Works"
          title="Simple like SendCutSend—built for production teams."
          subtitle="Fast parts, predictable lead times, and a team that can assemble at scale."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {steps.map((s) => (
            <Card key={s.title} className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-base font-semibold">{s.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {s.desc}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">
                Need repeatable, ongoing production?
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Ask about scheduled runs, stocking programs, and kitting/assembly
                for launches.
              </div>
            </div>
            <Button className="rounded-2xl" asChild>
              <a href="#quote">
                Talk to a human <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const caps = [
    {
      title: "Laser Cutting",
      points: [
        "Clean edge quality on acrylic and wood",
        "High-speed production for flat parts",
        "Great for signage, displays, packaging, templates",
      ],
      icon: Sparkles,
    },
    {
      title: "CNC Routing",
      points: [
        "Plastics + composites + sheet goods",
        "Pockets, profiles, holes, chamfers (as required)",
        "Ideal for thicker materials and assemblies",
      ],
      icon: Layers,
    },
    {
      title: "Finishing",
      points: [
        "Sanding / edge cleanup when needed",
        "Protective films + handling protocols",
        "Custom packaging options",
      ],
      icon: ShieldCheck,
    },
    {
      title: "Assembly + Kitting",
      points: [
        "Fast ramp: 10–50+ hands when needed",
        "Labeling, bagging, boxed kits",
        "Multi-step build processes with QC",
      ],
      icon: Wrench,
    },
  ];

  return (
    <section id="capabilities" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeader
          eyebrow="Capabilities"
          title="Everything you need to go from CAD to shipped product."
          subtitle="Cut, machine, finish, assemble, and fulfill—under one roof in the USA."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {caps.map((c) => (
            <Card key={c.title} className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold">{c.title}</div>
                    <ul className="mt-3 space-y-2">
                      {c.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Leaf className="h-5 w-5" />
                Impact included
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Every product plants a tree. Make sustainability a measurable
                part of your vendor strategy.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-base font-semibold">
                <ShieldCheck className="h-5 w-5" />
                Production-grade QC
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Consistency matters. We document specs, check critical
                dimensions, and protect finishes.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Timer className="h-5 w-5" />
                Predictable lead times
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Standard 2–5 business days. Add scheduled runs for launches and
                evergreen SKUs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  return (
    <section id="faqs" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeader
          eyebrow="FAQs"
          title="Common questions"
          subtitle="If you don't see your question here, send a note and we'll help fast."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What file types do you accept?</AccordionTrigger>
              <AccordionContent>
                DXF and SVG are ideal for cutting. We can also work from AI and
                PDF for many jobs. For 3D machining or complex work, STEP can
                help (optional). If you&apos;re unsure, upload what you have and
                we&apos;ll advise.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What&apos;s your standard lead time?
              </AccordionTrigger>
              <AccordionContent>
                Most orders ship in 2–5 business days once approved. Lead time
                can vary based on material availability, finishing, and assembly
                complexity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Do you do assembly and kitting?
              </AccordionTrigger>
              <AccordionContent>
                Yes. We provide skilled hand assembly, labeling, bagging, box
                builds, and multi-step kitting with QC. If you have a process,
                we can document and run it repeatedly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Is everything truly made in the USA?
              </AccordionTrigger>
              <AccordionContent>
                Manufacturing is performed in the USA. If a specific raw
                material has a country-of-origin requirement, tell us and
                we&apos;ll source accordingly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                How does &quot;Buy One. Plant One.&quot; work?
              </AccordionTrigger>
              <AccordionContent>
                Every product we make triggers tree planting through our
                program. For enterprise programs, we can provide reporting and
                branded forest allocations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-t">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Text Content */}
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src="/family-owned-logo.png"
                  alt="Family Owned Business"
                  width={60}
                  height={60}
                  className="h-14 w-auto"
                />
                <Badge variant="outline" className="rounded-full text-xs">
                  Est. 2012
                </Badge>
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Family Owned.<br />
                <span className="text-primary">American Made.</span><br />
                Nature Focused.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Founded with a mission to put nature back into people&apos;s lives, bring jobs back to America, and bring quality back to products.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="rounded-full px-4 py-2">
                  <Leaf className="mr-2 h-4 w-4" /> Buy One. Plant One.
                </Badge>
                <Badge variant="secondary" className="rounded-full px-4 py-2">
                  <ShieldCheck className="mr-2 h-4 w-4" /> 100% USA Made
                </Badge>
              </div>
            </div>

            {/* Right: Family Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/ben-and-family.webp"
                  alt="Ben & Zoie VandenWymelenberg - Founders, WOODCHUCK USA"
                  width={600}
                  height={450}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-primary/10" />
              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 backdrop-blur p-3 shadow-lg">
                <p className="text-sm font-medium">Ben &amp; Zoie VandenWymelenberg</p>
                <p className="text-xs text-muted-foreground">Founders, WOODCHUCK USA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="border-y bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">4M+</div>
              <div className="mt-1 text-sm text-muted-foreground">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold md:text-4xl">6</div>
              <div className="mt-1 text-sm text-muted-foreground">Continents Reached</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold md:text-4xl">2012</div>
              <div className="mt-1 text-sm text-muted-foreground">Year Founded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold md:text-4xl">100%</div>
              <div className="mt-1 text-sm text-muted-foreground">Made in USA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Origin Story */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold">Our Story</h3>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                It all started with a cracked iPhone. After wiping out on Rollerblades, Ben VandenWymelenberg—then an architecture student at the University of Minnesota—decided to craft a phone case from wood scraps. Friends wanted one too, and WOODCHUCK USA was born.
              </p>
              <p>
                What began as handcrafted wood phone skins quickly grew into a nationwide brand, landing in 1,800 Target stores within six months. Today, some of the world&apos;s most iconic brands choose WOODCHUCK USA, including Chanel, Nike, Jack Daniel&apos;s, Land Rover, and Patrón Tequila.
              </p>
              <p>
                Together with his wife Zoie and a passionate team, Ben continues to expand WOODCHUCK USA&apos;s impact across custom cutting, packaging, corporate gifting, and more. The company has been bootstrapped from day one, driven by a passion for sustainability and a desire to give back.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="mt-8 border-l-4 border-primary pl-6">
              <p className="text-lg italic">
                &quot;I founded WOODCHUCK USA with a mission to connect people with nature through beautifully designed, sustainable products. Our goal is to leave the planet better than we found it.&quot;
              </p>
              <footer className="mt-3 text-sm text-muted-foreground">
                — Ben VandenWymelenberg, Founder &amp; CEO
              </footer>
            </blockquote>
          </div>

          {/* Side Cards */}
          <div className="space-y-4">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-semibold">Buy One. Plant One.®</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Every product triggers tree planting through our program. Over 4 million trees planted across six continents.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-semibold">Community Impact</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  We partner with Dodge Nature Center to get inner-city kids outdoors and offer employees adventure gear to explore nature.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-semibold">Nature Link Resorts</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Ben and Zoie co-founded Nature Link Resorts, creating unique cabin experiences to help people reconnect with nature.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-14 flex flex-col items-center justify-center gap-6 border-t pt-10 sm:flex-row sm:gap-10">
          <Image
            src="/woodchuck-logo.png"
            alt="Woodchuck USA - Made in USA"
            width={160}
            height={56}
            className="h-12 w-auto"
          />
          <div className="h-8 w-px bg-border hidden sm:block" />
          <Image
            src="/family-owned-logo.png"
            alt="Family Owned Business"
            width={60}
            height={60}
            className="h-12 w-auto"
          />
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    description: "",
  });

  const canSubmit = useMemo(() => {
    const emailOk = form.email.trim().includes("@");
    return (
      form.name.trim().length > 1 &&
      emailOk &&
      form.description.trim().length > 10
    );
  }, [form]);

  return (
    <section id="quote" className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeader
          eyebrow="Get a Quote"
          title="Tell us what you're building. We'll make it fast."
          subtitle="Drop in specs, notes, and any assembly details. We'll respond quickly with next steps."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  className="rounded-2xl"
                  placeholder="Your name*"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <Input
                  className="rounded-2xl"
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, company: e.target.value }))
                  }
                />
                <Input
                  className="rounded-2xl"
                  placeholder="Email*"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <Input
                  className="rounded-2xl"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>

              <div className="mt-3">
                <Textarea
                  className="min-h-[140px] rounded-2xl"
                  placeholder="What do you need cut? Include material, thickness, qty, finish, and whether you need assembly/kitting.*"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HelpCircle className="h-4 w-4" />
                  <span>
                    Tip: include an example photo or link to your product page
                    for fastest quoting.
                  </span>
                </div>
                <Button
                  size="lg"
                  className="rounded-2xl"
                  disabled={!canSubmit}
                  onClick={() =>
                    alert("Connect this to your CRM/quote system.")
                  }
                >
                  Submit Quote Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="text-base font-semibold">Contact</div>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4" />
                    <span>sales@woodchuckusa.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4" />
                    <span>612.840.3360</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    <span>Made in Minnesota, USA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="text-base font-semibold">
                  Why teams choose us
                </div>
                <ul className="mt-3 space-y-2">
                  {[
                    "Fast, repeatable production",
                    "Assembly + kitting under one roof",
                    "USA-made + responsive communication",
                    "Tree planted for every product",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Image
              src="/woodchuck-logo.png"
              alt="Woodchuck USA - Made in USA"
              width={140}
              height={50}
              className="h-10 w-auto"
            />
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl border shadow-sm">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="text-xs text-muted-foreground">
                Custom Cutting + Assembly
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Made in the USA. Built fast. Better for the planet.
            </p>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Services</div>
            <div className="mt-3 space-y-2 text-muted-foreground">
              <div>Laser cutting</div>
              <div>CNC routing</div>
              <div>Finishing</div>
              <div>Assembly + kitting</div>
              <div>Drop-ship fulfillment</div>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Compliance</div>
            <div className="mt-3 space-y-2 text-muted-foreground">
              <div>100% Made in USA manufacturing</div>
              <div>2–5 day standard turn times</div>
              <div>Buy One. Plant One.</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/family-owned-logo.png"
              alt="Family Owned Business"
              width={60}
              height={60}
              className="h-12 w-auto"
            />
            <div>
              © {new Date().getFullYear()} WOODCHUCK USA. All rights reserved.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Leaf className="h-4 w-4" /> Tree planted per product
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> USA-made
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main>
        <Hero />
        <Materials />
        <HowItWorks />
        <Capabilities />
        <FAQs />
        <AboutSection />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  );
}
