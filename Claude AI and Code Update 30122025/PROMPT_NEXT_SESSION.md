# Prompt for Next Claude Code Session

**Date:** December 30, 2025
**Previous Session:** Workflows & Automations Phase 1 (Complete)
**Next Session:** TBD

---

## Session Context

You are continuing work on **MY HOST BizMate**, a vacation rental property management SaaS platform. The previous session (December 30, 2025) completed the **Workflows & Automations module (Phase 1)**.

---

## Recent Accomplishments (Dec 30, 2025)

### Workflows & Automations Module ✅
**Commit:** 618b027

**Completed:**
- ✅ Database migration (013_workflows_tables.sql) with workflow_settings and workflow_executions tables
- ✅ Configuration file (workflowsConfig.js) with 4 workflows, 6 quick actions, 2 scheduled tasks
- ✅ Service layer (workflowsService.js) with Supabase integration
- ✅ 5 UI components: StatsCards, QuickActionsGrid, AutomatedWorkflows, ScheduledTasks, RecentActivity
- ✅ Main Workflows page with data orchestration and toast notifications
- ✅ WorkflowTester redesigned with corporate dark theme (#1a1f2e, #252b3b, #d85a2a)
- ✅ WhatsApp AI testing integration (n8n Workflow VIII)
- ✅ Functional workflow toggles with real-time Supabase updates
- ✅ Real-time statistics dashboard
- ✅ Execution history feed

**Key Features:**
- 4 automated workflows with ON/OFF toggles
- 6 quick actions (WhatsApp AI Agent navigates to tester, others inactive)
- Dark theme with corporate orange (#d85a2a)
- 3-column responsive grid for quick actions
- No "Coming Soon" badges
- Toast notifications for success/error

**Documentation:**
- `WORKFLOWS_AUTOMATIONS_IMPLEMENTATION.md` - Complete technical documentation (23 pages)
- `WORKFLOWS_PLAN_APPROVED.md` - Original approved plan

---

## Current State of Codebase

### Branch
**Active:** `backup-antes-de-automatizacion`
**Main:** `main` (protected, do not push directly)

### Latest Commits
1. `618b027` - feat: Complete Workflows & Automations module (Phase 1)
2. `03fd3cb` - feat: Complete Guest Communications module with BYOK architecture
3. `f1ae169` - docs: Add Guest Communications documentation

### Module Status

| Module | Status | Phase | Documentation |
|--------|--------|-------|---------------|
| **Workflows & Automations** | ✅ Complete | Phase 1 | ✅ Full docs |
| **Guest Communications** | ✅ Complete | Phase 1 | ✅ Full docs |
| **My Site** | ✅ Complete | - | ✅ In code |
| **Properties** | ✅ Complete | - | ✅ In CLAUDE.md |
| **Bookings** | ✅ Complete | - | ✅ In CLAUDE.md |
| **Dashboard** | ✅ Complete | - | ✅ In CLAUDE.md |
| Others | 🟡 Partial | - | - |

---

## Pending Tasks

### High Priority
These tasks were on the original list for December 30 but not completed:

1. **Reorder GUEST & GROWTH menu items** ⏳
   - Current: Items may not be in optimal order
   - Required: Review and reorganize sidebar menu

2. **Update PublicSite contact section** ⏳
   - Current: May have placeholder content
   - Required: Add real contact information and styling

### Phase 2 - Workflows & Automations
Deferred features from the Workflows module:

1. **ExecutionModal Component**
   - Dynamic form fields based on workflow type
   - Booking selection dropdown
   - Date range pickers
   - Campaign type selector
   - Input validation

2. **n8n Webhook Integration**
   - Connect 4 Quick Actions to n8n webhooks:
     - Send Welcome Email
     - Generate Occupancy Report
     - Sync Availability
     - Send Promo Campaign
   - Handle webhook responses
   - Display execution results

3. **Real-time Updates**
   - WebSocket or polling for Recent Activity
   - Auto-refresh every 30 seconds
   - Push notifications for failed workflows

4. **Advanced Features**
   - Full activity history view (paginated)
   - Export activity to CSV/PDF
   - Workflow configuration modals
   - Voice AI testing (separate from Talk to Ayu)

---

## Known Issues

### 1. WhatsApp AI Tester
**Issue:** Does not show AI responses in UI
**Reason:** n8n Workflow VIII sends responses to WhatsApp via ChakraHQ, not back to tester
**Impact:** Users must test from mobile phone
**Solution (Future):** Create separate testing webhook that returns responses directly

### 2. Quick Actions (4 of 6)
**Issue:** Send Welcome Email, Generate Report, Sync Availability, Send Promo do nothing
**Reason:** Phase 2 feature
**Impact:** Users cannot execute these actions yet
**Solution:** Implement ExecutionModal and n8n integration

---

## Architecture Notes

### Database
- **Supabase:** jjpscimtxrudtepzwhag.supabase.co
- **Latest Migration:** 013_workflows_tables.sql (executed ✅)
- **Tables:** workflow_settings, workflow_executions
- **Property ID (Izumi Hotel):** 18711359-1378-4d12-9ea6-fb31c0b1bac2

### External Services
- **n8n:** https://n8n-production-bb2d.up.railway.app
- **Workflow VIII (WhatsApp):** 894ed1af-89a5-44c9-a340-6e571eacbd53
- **Amazon SES:** Email service (Guest Communications)
- **Meta WhatsApp API:** WhatsApp Business integration

### Frontend
- **Framework:** React 18.2 + Vite
- **Styling:** Tailwind CSS with dark theme
- **Colors:** #1a1f2e (background), #252b3b (cards), #d85a2a (primary orange)
- **Icons:** Lucide React
- **Charts:** Recharts

---

## Guidelines for Next Session

### Before Starting Work

1. **Read Recent Documentation**
   - `WORKFLOWS_AUTOMATIONS_IMPLEMENTATION.md`
   - `CLAUDE.md` (project overview)
   - Recent commit messages

2. **Ask User for Priorities**
   - Which task from the pending list?
   - New feature request?
   - Bug fixes?

3. **Create Implementation Plan**
   - Present plan to user BEFORE coding
   - Get explicit approval
   - Ask clarifying questions if needed

### During Implementation

1. **Read Files Before Editing**
   - Always use Read tool before Edit/Write
   - Understand existing patterns
   - Maintain consistency

2. **Follow Existing Patterns**
   - Dark theme colors (#1a1f2e, #252b3b, #d85a2a)
   - Component structure (onBack prop, responsive layout)
   - Service layer pattern (mock fallback)
   - Database: Supabase with RPC functions

3. **Test Before Committing**
   - Let user test in localhost
   - Get explicit approval for commit
   - NEVER commit without user approval

4. **Documentation**
   - Create comprehensive docs for major features
   - Update CLAUDE.md if architecture changes
   - Include technical details and examples

### Code Quality

1. **No Emojis** (unless user explicitly requests)
2. **Professional Tone** in code comments
3. **Consistent Naming** (camelCase for JS, kebab-case for files)
4. **No Console.log** in production code
5. **Error Handling** with user-friendly messages

---

## Common User Preferences

Based on previous sessions:

1. **Pace:** User prefers methodical, well-planned approach over rushing
2. **Approval:** Always get approval before major actions (commits, migrations, etc.)
3. **Documentation:** User values comprehensive documentation
4. **Communication:** User prefers clear explanations in English
5. **Testing:** User always tests thoroughly before approving

### Communication Style
- **Be Professional:** No casual language or excessive enthusiasm
- **Be Accurate:** Don't guess or make assumptions
- **Be Patient:** Wait for user validation at each step
- **Be Thorough:** Read specifications completely before starting
- **Be Honest:** If unsure, ask for clarification

---

## Quick Reference

### File Locations

**Components:**
- Workflows: `src/components/Workflows/`
- Guest Communications: `src/components/GuestCommunications/`
- Common: `src/components/common/`

**Services:**
- `src/services/supabase.js` - Main Supabase client
- `src/services/workflowsService.js` - Workflows API
- `src/services/guestCommunicationsService.js` - Guest Comms API
- `src/services/*Mocks.js` - Mock data for development

**Configuration:**
- `src/lib/workflowsConfig.js` - Workflow definitions
- `vite.config.js` - Build configuration
- `tailwind.config.js` - Styling configuration

**Database:**
- `supabase/migrations/` - SQL migration files

**Documentation:**
- `CLAUDE.md` - Main project documentation
- `Claude AI and Code Update 30122025/` - Session documentation

### Commands

```bash
# Development
npm run dev              # Start dev server (port 5173-5176)
npm run build            # Build for production
npm run preview          # Preview production build

# Git
git status               # Check changes
git add -A               # Stage all changes
git commit -m "message"  # Commit (get user approval first!)
git log --oneline -5     # View recent commits

# Deployment
vercel --prod --yes      # Deploy to production (if needed)
```

### Environment

- **Working Directory:** C:\myhost-bizmate
- **Platform:** Windows (Git Bash)
- **Node Version:** 18+
- **Dev Server:** Usually http://localhost:5174 or 5175 or 5176
- **Production:** https://my-host-bizmate.vercel.app

---

## Suggested Next Steps

Based on the pending tasks and project direction:

### Option A: Finish December 30 Tasks
1. Reorder GUEST & GROWTH menu items in Sidebar
2. Update PublicSite contact section
3. Test everything end-to-end

### Option B: Workflows Phase 2
1. Implement ExecutionModal component
2. Connect Quick Actions to n8n
3. Add real-time activity updates

### Option C: New Feature
1. User provides new requirement
2. Create detailed plan
3. Get approval and implement

### Option D: Bug Fixes / Polish
1. Review existing modules for issues
2. Improve error handling
3. Add loading states where missing

**Recommendation:** Ask user what they want to prioritize.

---

## Important Reminders

1. **NEVER commit without explicit user approval**
2. **ALWAYS create a plan before implementing**
3. **READ specifications completely before starting**
4. **TEST in localhost before committing**
5. **CREATE comprehensive documentation**
6. **WAIT for user validation at each step**

---

## Example Opening Message for Next Session

```
Hello! I'm ready to continue working on MY HOST BizMate.

In the last session (December 30, 2025), we completed the Workflows & Automations
module (Phase 1) with full functionality for workflow toggles, statistics dashboard,
and WhatsApp AI testing.

I have the complete context from:
- Workflows & Automations implementation (618b027)
- Guest Communications module (03fd3cb)
- Current project state in CLAUDE.md

What would you like to work on today?

Pending from last session:
1. Reorder GUEST & GROWTH menu items
2. Update PublicSite contact section
3. Workflows Phase 2 features

Or do you have a new requirement?
```

---

**Prompt created:** December 30, 2025
**For use in:** Next Claude Code session
**Version:** 1.0
