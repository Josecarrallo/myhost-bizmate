# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MY HOST BizMate is a vacation rental property management platform with integrated AI capabilities. It provides comprehensive tools for property management, bookings, payments, messaging, marketing, and workflow automation.

**Stack:**
- React 18.2 + Vite
- Tailwind CSS 3.3
- Supabase (PostgreSQL + Auth)
- Recharts for data visualization
- Lucide React for icons

**Current Branch:** `backup-antes-de-automatizacion` (work happens here)
**Main Branch:** `main` (protected)
**Live URL:** https://my-host-bizmate.vercel.app

## Development Commands

```bash
# Start development server (runs on localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Architecture

### Recent Refactors

**December 21, 2025 - Authentication Stability Fix + n8n Workflows**:
- Fixed infinite loading screen on login/logout (Promise.race with 3s timeout)
- Resolved corrupted localStorage issues after logout (sessionStorage migration)
- Implemented visible Logout button in sidebar (red button at bottom)
- Improved signOut() to clear state first, then Supabase (optimistic updates)
- Added mounted flag to prevent state updates after unmount
- Changed storage from localStorage → sessionStorage (more secure, clears on browser close)
- Fixed Bookings component service import (dataService.getBookings)
- Fixed Dashboard not refreshing after property creation (key prop)
- Created n8n workflow for New Property notifications (Email + WhatsApp)
- Created clear_session.html utility for debugging
- Users can now login/logout seamlessly without manual localStorage.clear()

**📁 Complete Documentation (Dec 21):**
- `Claude AI and Code Update 21122025/RESUMEN_EJECUTIVO_21DIC2025.md` - Executive summary
- `Claude AI and Code Update 21122025/TECHNICAL_DEEP_DIVE_AUTH_SESSION.md` - Technical deep dive
- `Claude AI and Code Update 21122025/N8N_WORKFLOWS_DOCUMENTATION.md` - n8n workflows inventory
- `Claude AI and Code Update 21122025/CHANGELOG_21DIC2025.md` - Complete changelog
- `Claude AI and Code Update 21122025/SESSION_21DIC2025_AUTH_N8N.md` - Session log

**Commits:** dd77f6f, 0a0e91f, e5e6359, 9cebd5c, f6746db

**December 20, 2025 - Complete My Site Module + React Router**:
- Implemented complete "My Site" module for creating direct booking websites
- 5-step wizard for property owners to build their own websites in 5 minutes
- Public website component (PublicSite) with professional landing pages
- React Router integration for public URLs (`/site/:slug`)
- 5 professional visual themes (Bali Minimal, Tropical Luxury, Ocean Breeze, Sunset Warmth, Jungle Modern)
- WhatsApp booking integration
- Enhanced login page with large branding display
- Fixed text input bugs (controlled → uncontrolled inputs)
- Service layer (mySiteService.js) with localStorage (ready for Supabase)
- shadcn/ui components integrated (Dialog, Input, Checkbox, Progress, etc.)
- vercel.json added for SPA routing in production

**December 19, 2025 - Professional Collapsible Sidebar + AI Agents Reorganization**:
- Implemented professional collapsible sidebar navigation (like Airbnb/Booking.com)
- 6 main sections with expand/collapse functionality
- Reorganized AI agents: AIReceptionist → AIAgentsMonitor (moved to PMS CORE)
- Clear separation: PMS CORE (internal staff tools) vs GUEST MANAGEMENT (managing guest experience)
- All collapsible sections start closed for clean initial view
- Added chevron icons for visual feedback (ChevronRight/ChevronDown)
- Direct link buttons for OVERVIEW and SETTINGS
- Active state highlighting with orange-50 background
- Integrated real villa photos (villa1-6.jpg) in Properties module

**December 16, 2025 - Dashboard Restructure**:
- Implemented sidebar navigation with persistent layout
- Eliminated splash screen and modules grid
- Added Owner Executive Summary as default post-login view
- Created Sidebar component for organized navigation
- Simplified routing from 2 state variables to 1 (`currentView`)
- Fixed layout issues for all modules to work with sidebar
- All modules now use `flex-1 h-screen overflow-auto` pattern

**November 2025 - Module Extraction**:
- Reduced `App.jsx` from 4,019 lines to 214 lines (94.7% reduction)
- Extracted 21 modules into separate components

### Component Structure

```
src/
├── App.jsx                    # Main app routing (214 lines)
├── App.jsx.backup             # Original monolith backup (DO NOT MODIFY)
├── main.jsx                   # React entry point
├── index.css                  # Global styles
├── components/
│   ├── common/                # 10 reusable UI components
│   │   ├── ModuleCard.jsx
│   │   ├── ModuleGridCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── PaymentCard.jsx
│   │   ├── BookingCard.jsx
│   │   ├── MessageCard.jsx
│   │   ├── PropertyCard.jsx
│   │   ├── PricingCard.jsx
│   │   ├── CampaignCard.jsx
│   │   ├── WorkflowCard.jsx
│   │   └── index.js           # Barrel exports
│   ├── Auth/
│   │   └── LoginPage.jsx      # Split layout login screen
│   ├── Layout/
│   │   └── Sidebar.jsx        # Persistent navigation sidebar
│   ├── Dashboard/
│   │   ├── Dashboard.jsx      # Analytics dashboard (legacy)
│   │   └── OwnerExecutiveSummary.jsx  # NEW: Default post-login view
│   ├── Payments/
│   ├── Bookings/
│   ├── Messages/
│   ├── Properties/
│   ├── AIAssistant/
│   ├── AIAgentsMonitor/      # Renamed from AIReceptionist (Dec 19, 2025)
│   ├── Multichannel/
│   ├── Marketing/
│   ├── SocialPublisher/
│   ├── SmartPricing/
│   ├── Reports/
│   ├── PMSCalendar/
│   ├── BookingEngine/
│   ├── VoiceAI/
│   ├── Operations/
│   ├── Reviews/
│   ├── RMSIntegration/
│   ├── DigitalCheckIn/
│   ├── CulturalIntelligence/
│   └── Workflows/
│       ├── Workflows.jsx
│       ├── AITripPlanner.jsx
│       └── BookingWorkflow.jsx
├── services/
│   └── supabase.js            # Centralized Supabase API service
└── context/
    └── AppContext.jsx         # Global state management (currently minimal)
```

### Module Organization

**Sidebar Navigation Structure (December 19, 2025):**

Modules are organized into 6 main collapsible sections in the sidebar:

1. **OVERVIEW** (Direct Link)
   - Owner Executive Summary (default view)

2. **OPERATIONS & GUESTS** (Collapsible)
   - Dashboard
   - Properties
   - Bookings
   - Calendar
   - Guests

3. **REVENUE & PRICING** (Collapsible)
   - Payments
   - Smart Pricing
   - Reports
   - Channel Integration

4. **PMS CORE (Internal Agent)** (Collapsible)
   - AI Assistant (staff chat)
   - AI Agents Monitor (WhatsApp & VAPI monitoring)
   - Workflows & Automations

5. **GUEST MANAGEMENT (External Agent)** (Collapsible)
   - Guest Database / CRM
   - Booking Engine Config
   - Digital Check-in Setup
   - Reviews Management
   - Marketing Campaigns
   - Guest Analytics

6. **SETTINGS** (Direct Link)
   - Settings & Configuration

**Note:** PMS CORE contains internal tools for staff operations, while GUEST MANAGEMENT contains tools for managing the guest experience (not a guest-facing portal).

### Routing Pattern

**Current System (December 2025)**:

App.jsx uses a simplified view-based routing with persistent sidebar:
- `currentView`: Single state variable controlling which view is displayed
- Sidebar navigation always visible (except on mobile)
- Default view: `overview` (OwnerExecutiveSummary)

**Layout Structure**:
```jsx
<div className="flex h-screen overflow-hidden bg-gray-50">
  <Sidebar
    currentView={currentView}
    onNavigate={setCurrentView}
    isOpen={isSidebarOpen}
    onClose={() => setIsSidebarOpen(false)}
  />
  {renderContent()}
</div>
```

**Sidebar Features:**
- Collapsible sections with expand/collapse state
- Chevron icons for visual feedback (ChevronRight → ChevronDown)
- All sections start collapsed for clean initial view
- Direct link buttons for OVERVIEW and SETTINGS (no sub-items)
- Active state highlighting with orange-50 background
- Mobile-responsive drawer with backdrop overlay

**View Rendering**:
```jsx
const renderContent = () => {
  switch (currentView) {
    case 'overview':
      return <OwnerExecutiveSummary userName={userData?.full_name} />;
    case 'properties':
      return <Properties key="properties" onBack={() => setCurrentView('overview')} />;
    // ... other views
  }
};
```

**Important**: Module components that fetch data should use `key` prop to force remount on navigation, ensuring fresh data loads.

All module components receive an `onBack` callback prop to return to the overview. The Workflows component also receives `onNavigate` to enable sub-module navigation.

### Component Patterns

**Common Components:**
All reusable UI components are in `src/components/common/` and exported via barrel file (`index.js`). Import them like:

```jsx
import { StatCard, BookingCard, MessageCard } from '../common';
```

**Module Components:**
Each module follows this pattern:
- Container div: `className="flex-1 h-screen ... overflow-auto"` (fills available space next to sidebar)
- Receives `onBack` prop for navigation to overview
- Uses gradient backgrounds (`bg-gradient-to-br from-[color] via-[color] to-[color]`)
- Includes header with back button, title, and action buttons
- Uses Lucide React icons
- Responsive design with Tailwind CSS
- Data-fetching modules should receive `key` prop in App.jsx for proper remounting

**Example Module Structure**:
```jsx
const MyModule = ({ onBack }) => {
  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 relative overflow-auto">
      {/* Content */}
    </div>
  );
};
```

**Styling:**
- Primary brand color: Orange 500 (`bg-orange-500`)
- Secondary: Pink/Purple gradients
- All buttons use rounded corners (usually `rounded-2xl` or `rounded-3xl`)
- Consistent shadow usage (`shadow-lg`, `shadow-xl`)
- Hover effects with `transition-all` or `transition-colors`

## Supabase Integration

The project uses Supabase for backend services:

**Service File:** `src/services/supabase.js`

Current implementation includes:
- Property management (create, read)
- Centralized headers and configuration
- Ready for expansion to other resources

**Supabase URL:** `https://jjpscimtxrudtepzwhag.supabase.co`

**Note:** API keys are stored in `src/services/supabase.js` (public anon key only)

When adding new Supabase functionality:
1. Add methods to `supabaseService` object in `src/services/supabase.js`
2. Import and use in module components
3. Handle loading states and errors appropriately

## n8n Automation

The project includes n8n workflow automation hosted on Railway:

**n8n Instance:** https://n8n-production-bb2d.up.railway.app

**Automation Categories:**
1. Booking Management (confirmations, payments, cancellations)
2. AI & Personalization (recommendations, cultural intelligence, trip planning)
3. Operations (check-in, cleaning, maintenance, inventory)
4. Marketing & Reviews (social media, campaigns, review requests)

**Configuration:**
- Credentials stored in `n8n_Supabase/.env.automation.txt` (gitignored)
- SendGrid configured for emails
- Supabase connected for data access
- Claude API integration planned for AI features

### n8n MCP Server (NEW)

**Location:** `.claude/mcp/n8n/`

An MCP (Model Context Protocol) server is available for direct n8n workflow management through Claude Code.

**Capabilities:**
- `list_workflows` - List all workflows with status
- `create_workflow` - Create new workflows from natural language
- `get_executions` - View execution history and debug errors
- `trigger_workflow` - Manually execute workflows with data
- `update_workflow` - Modify existing workflows

**Setup:**
1. Get n8n API key from Settings → API
2. Configure `claude_desktop_config.json` (see `.claude/mcp/n8n/INSTALL.md`)
3. Restart Claude Code
4. Use natural language: "List all my n8n workflows"

**Documentation:**
- Quick start: `.claude/mcp/n8n/QUICK_START.md`
- Full guide: `.claude/mcp/n8n/README.md`
- Setup instructions: `.claude/mcp/n8n/INSTALL.md`

**Usage Examples:**
```
"Create a workflow for booking confirmations"
"Show me the last 10 executions"
"Why did the payment workflow fail?"
"Add a Slack notification to the booking workflow"
```

**Benefits:**
- Create workflows in minutes instead of hours
- Debug errors instantly
- Iterate rapidly on workflow designs
- Manage all 21 planned workflows efficiently

## Important Files & Restrictions

**DO NOT MODIFY:**
- `src/App.jsx.backup` - This is the backup of the original monolith (4,019 lines) kept for reference

**Protected Branch:**
- `main` - Do not push directly to main
- Work on `backup-antes-de-automatizacion` branch

**Git Workflow:**
```bash
# Check current branch
git branch

# View recent commits
git log --oneline -5

# The major refactor commit
git show e149395
```

## Data Flow

1. **UI Layer:** React components in `src/components/`
2. **State Management:** Currently minimal, using React useState in App.jsx. AppContext exists but is not yet widely used
3. **API Layer:** `src/services/supabase.js` for backend communication
4. **Automation Layer:** n8n workflows trigger based on events/schedules

## Development Guidelines

**When Adding New Modules:**
1. Create component in `src/components/ModuleName/ModuleName.jsx`
2. Import in `App.jsx`
3. Add routing condition in module routing section
4. Add ModuleGridCard to appropriate thematic group
5. Use consistent patterns (onBack prop, gradient backgrounds, responsive design)

**When Creating New Common Components:**
1. Place in `src/components/common/`
2. Export in `src/components/common/index.js`
3. Follow existing patterns (props destructuring, Tailwind classes)

**Styling Conventions:**
- Use Tailwind utility classes (no custom CSS unless necessary)
- Maintain gradient color schemes per module type
- Responsive breakpoints: mobile-first with sm:, md:, lg: variants
- Interactive states: hover:, active:, group-hover:

**Code Organization:**
- Keep components focused and single-responsibility
- Extract repeated UI patterns to common components
- Use descriptive prop names
- Maintain consistent icon usage from Lucide React

## Testing & Verification

After making changes:
1. Run `npm run dev` to test locally
2. Check console for errors
3. Test navigation between modules
4. Verify responsive behavior
5. Test on localhost (typically port 5173-5176)

## Deployment

The project deploys to Vercel automatically via GitHub integration.

**Manual Deploy:**
```bash
vercel --prod --yes
```

**Environment:**
- Build command: `vite build`
- Output directory: `dist`
- Node version: 18+

## Project Context

This is a vacation rental management platform targeting property managers and hosts in Bali. The platform emphasizes:
- Modern, gradient-heavy UI design
- AI-powered automation and recommendations
- Multi-channel marketing capabilities
- Comprehensive analytics and reporting
- Guest experience personalization

**Demo Data:** All modules currently use hardcoded demo data. Real backend integration is in progress.

## Key Commits

- `0fac888` - **feat: Complete My Site module with public website builder and React Router** (Dec 20, 2025)
  - Full My Site module with 5-step wizard for creating direct booking websites
  - Public website component (PublicSite.jsx) with professional landing pages
  - React Router integration for `/site/:slug` public URLs
  - 5 visual themes (Bali Minimal, Tropical Luxury, Ocean Breeze, Sunset Warmth, Jungle Modern)
  - WhatsApp booking integration
  - Enhanced login page with large "AI Operating System" branding
  - Fixed text input bugs (controlled → uncontrolled inputs with onBlur)
  - Service layer with localStorage (ready for Supabase migration)
  - shadcn/ui components (Dialog, Input, Checkbox, Progress, RadioGroup, Textarea)
  - vercel.json for SPA routing in production
- `8c264b4` - **feat: Professional collapsible sidebar + AI agents reorganization** (Dec 19, 2025)
  - Implemented professional collapsible navigation (6 main sections)
  - Renamed AIReceptionist → AIAgentsMonitor (moved to PMS CORE)
  - Clear separation: PMS CORE (staff tools) vs GUEST MANAGEMENT (guest experience tools)
  - All sections start collapsed for clean UI
  - Added chevron icons for visual feedback
  - Integrated real villa photos (villa1-6.jpg)
  - Applied corporate orange branding
- `2f31adc` - **feat: Add Property modal + AI agent naming + UI fixes** (Dec 18, 2025)
- `a54b99d` - **feat: Implement dashboard restructure with sidebar navigation** (Dec 16, 2025)
  - Created Sidebar and OwnerExecutiveSummary components
  - Redesigned LoginPage with split layout
  - Simplified routing to single state variable
  - Fixed layout for all modules (Properties, Bookings, Multichannel, AIAssistant)
  - Fixed data reload bugs with key props
- `4c61585` - docs: Add documentation package for 09 DIC 2025
- `d2a3088` - docs: Add complete session documentation for 09 DIC 2025
- `e149395` - Refactor: Extract 21 modules from App.jsx monolith (4019 → 214 lines)
- `7d32967` - Update gitignore for Vercel and backend scripts
- `f663601` - Add project documentation and architecture files
- `f36303c` - Add Supabase integration and n8n automation workflows
- `26a6ae1` - Add Cultural Intelligence module and reorganize modules into themed groups
