"use client";

import { createContext, useContext } from "react";
import type { CmsDestination, CmsSettings, CmsTheme } from "@/types/cms";
import type { PackageViewModel } from "@/types/travel";
import { DEFAULT_CMS_SETTINGS, DEFAULT_CMS_THEME } from "@/lib/cmsDefaults";

interface CmsContextValue { settings: CmsSettings; packages: PackageViewModel[]; destinations: CmsDestination[]; theme: CmsTheme }
const CmsContext = createContext<CmsContextValue>({ settings: DEFAULT_CMS_SETTINGS, packages: [], destinations: [], theme: DEFAULT_CMS_THEME });
export function CmsProvider({ value, children }: { value: CmsContextValue; children: React.ReactNode }) { return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>; }
export function useCms() { return useContext(CmsContext); }
export function useCmsSettings() { return useContext(CmsContext).settings; }
