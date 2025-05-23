import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fileExtensionsCategories } from "./consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DateTimeOffsets = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

/**
 * Add years, months, days, hours, minutes, and/or seconds to a Date.
 * @param baseDate - The initial Date to adjust.
 * @param offsets - Object specifying how much to add to each part.
 * @returns A new Date object, adjusted by the specified offsets.
 */
export function addDateTime(baseDate: Date, offsets: DateTimeOffsets = {}): Date {
  const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = offsets;

  const newDate = new Date(baseDate.getTime());

  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + days);

  newDate.setHours(newDate.getHours() + hours);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setSeconds(newDate.getSeconds() + seconds);

  return newDate;
}

export function getAbbreviatedName(str?: string) {
  if (!str) return;

  return str
    .split(" ")
    .map((w) => w[0])
    .join("");
}

export function camelToCapitalized(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (char) => char.toUpperCase()) // Capitalize first letter
    .trim();
}

export const DEFAULT_BACKUP_CODE_SEGMENT_LENGTH = 3;
export function generateBackupCode(segmentLength?: number) {
  const segments = new Uint16Array(segmentLength || DEFAULT_BACKUP_CODE_SEGMENT_LENGTH);
  crypto.getRandomValues(segments);

  const backupCode = Array.from(segments)
    .map((num) => num.toString(16).padStart(4, "0"))
    .join("")
    .toUpperCase();

  return backupCode;
}

export async function copyToClipboard(textToCopy: string) {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (error) {
    throw error;
  }
}

export function groupFileTypesToChart(files: string[]): {
  chartConfig: { [key: string]: { label: string; color: string } };
  chartData: { [key: string]: number }[];
} {
  // Build extension-to-category lookup
  const extToCategory: Record<string, string> = {};
  for (const cat of fileExtensionsCategories) {
    for (const ext of cat.extensions) {
      extToCategory[ext] = cat.category;
    }
  }

  // Prepare an array with all known categories (from fileExtensionsCategories) plus "Others"
  const allCategories = fileExtensionsCategories.map((cat) => cat.category);
  allCategories.push("Others");

  // Initialize groups for each category
  const groups: {
    [key: string]: { category: string; files: string[]; count: number };
  } = {};
  for (const category of allCategories) {
    groups[category] = { category, files: [], count: 0 };
  }

  // Process each file once
  for (const file of files) {
    const fileName = file.split("/").pop();
    const ext = fileName?.split(".").pop()?.toLowerCase();
    // Determine category using the extension lookup; default to "Others"
    const category = ext && extToCategory[ext] ? extToCategory[ext] : "Others";
    groups[category].files.push(file);
    groups[category].count++;
  }

  // Create chartData: an array with a single object mapping category names to their counts
  const chartDataObject: { [key: string]: number } = {};
  for (const category of allCategories) {
    chartDataObject[category] = groups[category].count;
  }
  const chartData = [chartDataObject];

  // Create chartConfig: an object mapping category names to {label, color} pairs.
  // Colors are assigned sequentially using CSS variables: var(--chart-1), var(--chart-2), etc.
  const chartConfig: { [key: string]: { label: string; color: string } } = {};
  allCategories.forEach((category, index) => {
    chartConfig[category] = {
      label: category,
      color: `var(--chart-${index + 1})`,
    };
  });

  return { chartConfig, chartData };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const clamp = (x: number, min: number, max: number) => {
  return Math.min(Math.max(x, min), max);
};

import { LanguageFn } from "highlight.js";
import $1c from "highlight.js/lib/languages/1c";
import abnf from "highlight.js/lib/languages/abnf";
import accesslog from "highlight.js/lib/languages/accesslog";
import actionscript from "highlight.js/lib/languages/actionscript";
import ada from "highlight.js/lib/languages/ada";
import angelscript from "highlight.js/lib/languages/angelscript";
import apache from "highlight.js/lib/languages/apache";
import applescript from "highlight.js/lib/languages/applescript";
import arcade from "highlight.js/lib/languages/arcade";
import armasm from "highlight.js/lib/languages/armasm";
import asciidoc from "highlight.js/lib/languages/asciidoc";
import aspectj from "highlight.js/lib/languages/aspectj";
import autohotkey from "highlight.js/lib/languages/autohotkey";
import autoit from "highlight.js/lib/languages/autoit";
import avrasm from "highlight.js/lib/languages/avrasm";
import awk from "highlight.js/lib/languages/awk";
import axapta from "highlight.js/lib/languages/axapta";
import basic from "highlight.js/lib/languages/basic";
import bnf from "highlight.js/lib/languages/bnf";
import brainfuck from "highlight.js/lib/languages/brainfuck";
import cal from "highlight.js/lib/languages/cal";
import capnproto from "highlight.js/lib/languages/capnproto";
import ceylon from "highlight.js/lib/languages/ceylon";
import clean from "highlight.js/lib/languages/clean";
import clojure from "highlight.js/lib/languages/clojure";
import clojureRepl from "highlight.js/lib/languages/clojure-repl";
import cmake from "highlight.js/lib/languages/cmake";
import coffeescript from "highlight.js/lib/languages/coffeescript";
import coq from "highlight.js/lib/languages/coq";
import cos from "highlight.js/lib/languages/cos";
import crmsh from "highlight.js/lib/languages/crmsh";
import crystal from "highlight.js/lib/languages/crystal";
import csp from "highlight.js/lib/languages/csp";
import d from "highlight.js/lib/languages/d";
import dart from "highlight.js/lib/languages/dart";
import delphi from "highlight.js/lib/languages/delphi";
import django from "highlight.js/lib/languages/django";
import dns from "highlight.js/lib/languages/dns";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import dos from "highlight.js/lib/languages/dos";
import dsconfig from "highlight.js/lib/languages/dsconfig";
import dts from "highlight.js/lib/languages/dts";
import dust from "highlight.js/lib/languages/dust";
import ebnf from "highlight.js/lib/languages/ebnf";
import elixir from "highlight.js/lib/languages/elixir";
import elm from "highlight.js/lib/languages/elm";
import erb from "highlight.js/lib/languages/erb";
import erlang from "highlight.js/lib/languages/erlang";
import erlangRepl from "highlight.js/lib/languages/erlang-repl";
import excel from "highlight.js/lib/languages/excel";
import fix from "highlight.js/lib/languages/fix";
import flix from "highlight.js/lib/languages/flix";
import fortran from "highlight.js/lib/languages/fortran";
import fsharp from "highlight.js/lib/languages/fsharp";
import gams from "highlight.js/lib/languages/gams";
import gauss from "highlight.js/lib/languages/gauss";
import gcode from "highlight.js/lib/languages/gcode";
import gherkin from "highlight.js/lib/languages/gherkin";
import glsl from "highlight.js/lib/languages/glsl";
import gml from "highlight.js/lib/languages/gml";
import golo from "highlight.js/lib/languages/golo";
import gradle from "highlight.js/lib/languages/gradle";
import groovy from "highlight.js/lib/languages/groovy";
import haml from "highlight.js/lib/languages/haml";
import handlebars from "highlight.js/lib/languages/handlebars";
import haskell from "highlight.js/lib/languages/haskell";
import haxe from "highlight.js/lib/languages/haxe";
import hsp from "highlight.js/lib/languages/hsp";
import http from "highlight.js/lib/languages/http";
import hy from "highlight.js/lib/languages/hy";
import inform7 from "highlight.js/lib/languages/inform7";
import irpf90 from "highlight.js/lib/languages/irpf90";
import isbl from "highlight.js/lib/languages/isbl";
import jbossCli from "highlight.js/lib/languages/jboss-cli";
import julia from "highlight.js/lib/languages/julia";
import juliaRepl from "highlight.js/lib/languages/julia-repl";
import lasso from "highlight.js/lib/languages/lasso";
import latex from "highlight.js/lib/languages/latex";
import ldif from "highlight.js/lib/languages/ldif";
import leaf from "highlight.js/lib/languages/leaf";
import lisp from "highlight.js/lib/languages/lisp";
import livecodeserver from "highlight.js/lib/languages/livecodeserver";
import livescript from "highlight.js/lib/languages/livescript";
import llvm from "highlight.js/lib/languages/llvm";
import lsl from "highlight.js/lib/languages/lsl";
import mathematica from "highlight.js/lib/languages/mathematica";
import matlab from "highlight.js/lib/languages/matlab";
import maxima from "highlight.js/lib/languages/maxima";
import mel from "highlight.js/lib/languages/mel";
import mercury from "highlight.js/lib/languages/mercury";
import mipsasm from "highlight.js/lib/languages/mipsasm";
import mizar from "highlight.js/lib/languages/mizar";
import mojolicious from "highlight.js/lib/languages/mojolicious";
import monkey from "highlight.js/lib/languages/monkey";
import moonscript from "highlight.js/lib/languages/moonscript";
import n1ql from "highlight.js/lib/languages/n1ql";
import nestedtext from "highlight.js/lib/languages/nestedtext";
import nginx from "highlight.js/lib/languages/nginx";
import nim from "highlight.js/lib/languages/nim";
import nix from "highlight.js/lib/languages/nix";
import nodeRepl from "highlight.js/lib/languages/node-repl";
import nsis from "highlight.js/lib/languages/nsis";
import ocaml from "highlight.js/lib/languages/ocaml";
import openscad from "highlight.js/lib/languages/openscad";
import oxygene from "highlight.js/lib/languages/oxygene";
import parser3 from "highlight.js/lib/languages/parser3";
import pf from "highlight.js/lib/languages/pf";
import pgsql from "highlight.js/lib/languages/pgsql";
import pony from "highlight.js/lib/languages/pony";
import powershell from "highlight.js/lib/languages/powershell";
import processing from "highlight.js/lib/languages/processing";
import profile from "highlight.js/lib/languages/profile";
import prolog from "highlight.js/lib/languages/prolog";
import properties from "highlight.js/lib/languages/properties";
import protobuf from "highlight.js/lib/languages/protobuf";
import puppet from "highlight.js/lib/languages/puppet";
import purebasic from "highlight.js/lib/languages/purebasic";
import q from "highlight.js/lib/languages/q";
import qml from "highlight.js/lib/languages/qml";
import reasonml from "highlight.js/lib/languages/reasonml";
import rib from "highlight.js/lib/languages/rib";
import roboconf from "highlight.js/lib/languages/roboconf";
import routeros from "highlight.js/lib/languages/routeros";
import rsl from "highlight.js/lib/languages/rsl";
import ruleslanguage from "highlight.js/lib/languages/ruleslanguage";
import sas from "highlight.js/lib/languages/sas";
import scala from "highlight.js/lib/languages/scala";
import scheme from "highlight.js/lib/languages/scheme";
import scilab from "highlight.js/lib/languages/scilab";
import smali from "highlight.js/lib/languages/smali";
import smalltalk from "highlight.js/lib/languages/smalltalk";
import sml from "highlight.js/lib/languages/sml";
import sqf from "highlight.js/lib/languages/sqf";
import stan from "highlight.js/lib/languages/stan";
import stata from "highlight.js/lib/languages/stata";
import step21 from "highlight.js/lib/languages/step21";
import stylus from "highlight.js/lib/languages/stylus";
import subunit from "highlight.js/lib/languages/subunit";
import taggerscript from "highlight.js/lib/languages/taggerscript";
import tap from "highlight.js/lib/languages/tap";
import tcl from "highlight.js/lib/languages/tcl";
import thrift from "highlight.js/lib/languages/thrift";
import tp from "highlight.js/lib/languages/tp";
import twig from "highlight.js/lib/languages/twig";
import vala from "highlight.js/lib/languages/vala";
import vbscript from "highlight.js/lib/languages/vbscript";
import vbscriptHtml from "highlight.js/lib/languages/vbscript-html";
import verilog from "highlight.js/lib/languages/verilog";
import vhdl from "highlight.js/lib/languages/vhdl";
import vim from "highlight.js/lib/languages/vim";
import wren from "highlight.js/lib/languages/wren";
import x86asm from "highlight.js/lib/languages/x86asm";
import xl from "highlight.js/lib/languages/xl";
import xquery from "highlight.js/lib/languages/xquery";
import zephir from "highlight.js/lib/languages/zephir";
import arduino from "highlight.js/lib/languages/arduino";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import go from "highlight.js/lib/languages/go";
import graphql from "highlight.js/lib/languages/graphql";
import ini from "highlight.js/lib/languages/ini";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import less from "highlight.js/lib/languages/less";
import lua from "highlight.js/lib/languages/lua";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import objectivec from "highlight.js/lib/languages/objectivec";
import perl from "highlight.js/lib/languages/perl";
import php from "highlight.js/lib/languages/php";
import phpTemplate from "highlight.js/lib/languages/php-template";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import pythonRepl from "highlight.js/lib/languages/python-repl";
import r from "highlight.js/lib/languages/r";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import vbnet from "highlight.js/lib/languages/vbnet";
import wasm from "highlight.js/lib/languages/wasm";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

/**
 * Map of grammars.
 *
 * @type {Record<string, LanguageFn>}
 */
export const hljsGrammers: Record<string, LanguageFn> = {
  arduino,
  bash,
  c,
  cpp,
  csharp,
  css,
  diff,
  go,
  graphql,
  ini,
  java,
  javascript,
  json,
  kotlin,
  less,
  lua,
  makefile,
  markdown,
  objectivec,
  perl,
  php,
  "php-template": phpTemplate,
  plaintext,
  python,
  "python-repl": pythonRepl,
  r,
  ruby,
  rust,
  scss,
  shell,
  sql,
  swift,
  typescript,
  vbnet,
  wasm,
  xml,
  yaml,
  "1c": $1c,
  abnf,
  accesslog,
  actionscript,
  ada,
  angelscript,
  apache,
  applescript,
  arcade,
  armasm,
  asciidoc,
  aspectj,
  autohotkey,
  autoit,
  avrasm,
  awk,
  axapta,
  basic,
  bnf,
  brainfuck,
  cal,
  capnproto,
  ceylon,
  clean,
  clojure,
  "clojure-repl": clojureRepl,
  cmake,
  coffeescript,
  coq,
  cos,
  crmsh,
  crystal,
  csp,
  d,
  dart,
  delphi,
  django,
  dns,
  dockerfile,
  dos,
  dsconfig,
  dts,
  dust,
  ebnf,
  elixir,
  elm,
  erb,
  erlang,
  "erlang-repl": erlangRepl,
  excel,
  fix,
  flix,
  fortran,
  fsharp,
  gams,
  gauss,
  gcode,
  gherkin,
  glsl,
  gml,
  golo,
  gradle,
  groovy,
  haml,
  handlebars,
  haskell,
  haxe,
  hsp,
  http,
  hy,
  inform7,
  irpf90,
  isbl,
  "jboss-cli": jbossCli,
  julia,
  "julia-repl": juliaRepl,
  lasso,
  latex,
  ldif,
  leaf,
  lisp,
  livecodeserver,
  livescript,
  llvm,
  lsl,
  mathematica,
  matlab,
  maxima,
  mel,
  mercury,
  mipsasm,
  mizar,
  mojolicious,
  monkey,
  moonscript,
  n1ql,
  nestedtext,
  nginx,
  nim,
  nix,
  "node-repl": nodeRepl,
  nsis,
  ocaml,
  openscad,
  oxygene,
  parser3,
  pf,
  pgsql,
  pony,
  powershell,
  processing,
  profile,
  prolog,
  properties,
  protobuf,
  puppet,
  purebasic,
  q,
  qml,
  reasonml,
  rib,
  roboconf,
  routeros,
  rsl,
  ruleslanguage,
  sas,
  scala,
  scheme,
  scilab,
  smali,
  smalltalk,
  sml,
  sqf,
  stan,
  stata,
  step21,
  stylus,
  subunit,
  taggerscript,
  tap,
  tcl,
  thrift,
  tp,
  twig,
  vala,
  vbscript,
  "vbscript-html": vbscriptHtml,
  verilog,
  vhdl,
  vim,
  wren,
  x86asm,
  xl,
  xquery,
  zephir,
};
