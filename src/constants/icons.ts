import {
  Type, Mail, Phone, Hash, Lock, AlignLeft, ChevronDown, Circle, CheckSquare,
  ListChecks, ToggleLeft, Calendar, Clock, User, MapPin, Building2, Globe,
  CreditCard, FileText, Star, Flag, Home, Briefcase,
} from "lucide-react";

export const ICON_LIBRARY = {
  Type, Mail, Phone, Hash, Lock, AlignLeft, ChevronDown, Circle, CheckSquare,
  ListChecks, ToggleLeft, Calendar, Clock, User, MapPin, Building2, Globe,
  CreditCard, FileText, Star, Flag, Home, Briefcase,
};

export type IconKey = keyof typeof ICON_LIBRARY;
export type IconComponent = (typeof ICON_LIBRARY)[IconKey];
