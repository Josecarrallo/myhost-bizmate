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

**December 2025 - Dashboard Restructure**:
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

Modules are organized into 5 thematic groups in the UI:

1. **Operations & Guest Management:** Dashboard, Bookings, PMS Calendar, Properties, Operations Hub, Digital Check-in, Messages
2. **Revenue & Pricing:** Booking Engine, Payments, Smart Pricing, RMS Integration, Reports
3. **AI Intelligence Layer:** AI Assistant, Voice AI Agent, Cultural Intelligence
4. **Marketing & Growth:** Multichannel, Marketing, Social Publisher, Reviews
5. **Workflows & Automations:** Workflows (with sub-modules: AI Trip Planner, Booking Workflow)

### Routing Pattern

**Current System (December 2025)**:

App.jsx uses a simplified view-based routing with persistent sidebar:
- `currentView`: Single state variable controlling which view is displayed
- Sidebar navigation always visible (except on mobile)
- Default view: `overview` (OwnerExecutiveSummary)

**Layout Structure**:
```jsx
<div className="flex h-screen overflow-hidden bg-gray-50">
  <Sidebar currentView={currentView} onNavigate={setCurrentView} />
  {renderContent()}
</div>
```

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
