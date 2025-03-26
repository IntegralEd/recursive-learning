# IntegralEd Core Platform

## Overview
IntegralEd Core is a multi-tenant platform that provides AI-powered educational support and learning management capabilities. The platform is designed to be embedded within Softr sites while maintaining consistent branding and functionality across different educational institutions.

### Architectural Analogy

To better understand the architecture of the platform, let's use a restaurant analogy:

- **Airtable (Kitchen):** Airtable serves as the kitchen where all the data and content (ingredients) are stored and prepared. It's where the raw data is transformed into useful information.

- **Make.com and Assistants (Chefs):** Make.com (formerly Integromat) and AI Assistants are like the chefs who use the ingredients from the kitchen to create dishes. They process data, handle automation, and generate responses.

- **AWS Lambda (Expediter):** The AWS Lambda functions act as the expediter in the restaurant, coordinating between the kitchen and the dining room. They manage the flow of information, ensuring that the requests from the frontend are sent to the backend and responses are delivered promptly.

- **`docs/` Directory (Dining Room):** The `docs/` directory represents the dining room where customers interact with the menu and receive service from the waitstaff. It contains the frontend code (HTML, CSS, JavaScript) that provides the user interface and user experience.

This analogy helps illustrate how each component of the platform works together to deliver a seamless experience to the end-users.

## Key Features

### 1. RAG Chat System
- Contextual AI chat powered by domain-specific knowledge bases
- Tenant-specific agents with specialized knowledge
- Real-time learning support and guidance
- Preview mode for content testing and feedback

### 2. Support System
- Universal entry point for technical support
- Automated ticket creation and routing
- Context-aware issue resolution
- Integration with existing support workflows

### 3. Learning Management
- Course progress tracking
- Achievement system
- Learning record store (LRS) integration
- SCORM/xAPI compatibility

## Architecture

### Components
1. **Core Assets**
   - CSS Variables and Base Styles
   - JavaScript Utilities
   - Agent Configuration System
   - Event Logging Framework

2. **Tenant System**
   - Multi-tenant Support
   - Branding Configuration
   - Feature Flags
   - Agent Assignment

3. **Integration Layer**
   - Make.com Webhooks
   - LMS Connectors
   - Analytics Integration
   - Support Ticket System

## Implementation Guide

### 1. Basic Setup
1. Add the pre-header code block to your Softr site:
   ```html
   <!-- Copy from public/softr/pre-header.html -->
   ```

2. Create a chat page using:
   ```html
   <!-- Copy from public/softr/chat-page.html -->
   ```

### 2. Configuration
1. Set up tenant configuration in the admin panel
2. Configure agents and their capabilities
3. Customize branding and styling
4. Enable/disable features as needed

### 3. Testing
1. Use preview mode for testing new content
2. Add feedback notes for improvements
3. Monitor event logs for issues
4. Test different user scenarios

## Security & Compliance

### Data Protection
- HIPAA compliance for health data
- PII protection measures
- Secure data transmission
- Audit logging

### Access Control
- Role-based access
- Tenant isolation
- API key management
- Session security

## Development

### Local Setup
1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start development server

### Contributing
1. Follow coding standards
2. Use conventional commits
3. Submit pull requests
4. Update documentation

## Support & Resources

### Documentation
- [API Reference](https://docs.integral-ed.com/api-reference.html)
- [Integration Guide](https://docs.integral-ed.com/integration-guide.html)
- [Agent Documentation](https://docs.integral-ed.com/agent-readme.json)

### Contact
- Technical Support: support@integral-ed.com
- Documentation: docs@integral-ed.com
- Security: security@integral-ed.com

## License
Copyright © 2024 IntegralEd. All rights reserved.

# Recursive Learning MVP Deployment & Testing Plan

### Overview

**Hosting**: AWS Lambda; confirm before adding CORS.

**Parameter Management**: SSM decrypts API keys.

**Pages Deployment**: GitHub Pages at IntegralEd.

**Primary Hosting Domain**: [https://recursivelearning.app](https://recursivelearning.app)

### Deployment Options:

- `index.html` standalone embed on a client's site or inside Storyline.
- `index.html` in Storyline for session/user variable management and routing.

### MVP Milestones Achieved

✅ **Branded MVP chat UX fully deployed** – Same script across assistants with client-specific CSS.
✅ **Context-aware intake form built & tested** – Hardcoded for now, future integrations planned.
✅ **Hardcoded OpenAI Assistant IDs per page** – Passed via URL parameters or Softr wrapper.
✅ **Thread loading for returning users** – Fetching historical chat when `Thread_ID` exists.
✅ **Softr & Make webhooks are used to build context asynchronously**
✅ **Form for context-aware intake achieved in Recursive MVP example**

### Assistant API Lambda Implementation

### Routing Approach

- **Support Chat** → `asst_support_chat`
- **BMore Chat (Maternal Health Assistant)** → `asst_IA5PsJxdShVPTAv2xeXTr4Ma`
- **Sales Leads** → `asst_sales_assistant`
- **More Assistants in Future** → Airtable-controlled per org/user.

### Required URL Parameters

Each chat session will be initialized with:

- `Source` (e.g., referral page or Softr wrapper)
- `Org_ID`
- `Assistant_ID`
- `User_ID` (if returning)
- `Thread_ID` (if returning)
- `Action_ID` (if applicable)

### Lambda Deployment Path

**Lambda Function ARN**:\
`arn:aws:lambda:us-east-2:559050208320:function:IntegralEd-Main`

**Lambda Server Path**:\
`/Users/david/recursive-learning/lambda/index.js`

## Upcoming Work: AirTable Integration

- **Move `Assistant_ID` logic to AirTable** instead of `index.html` hardcoding.
- **AirTable variables drive assistant selection** per user/org.
- **Store `Thread_IDs` in AirTable** for better persistence.
- **Build Node modules for AirTable API calls in Lambda.**

## Testing Status & Goals

### ✅ 1. Lambda Testing

**Goal**: MVP chat with **Bmore RAG Assistant** is live and functional.\
**Status**: ✅ Tested and working.

### ✅ 2. Frontend MVP Test

**Goal**: Ensure the **branded chat loads properly**.\
**Status**: ✅ Verified across pages.

### ✅ 3. Client-Specific CSS & Branding

**Goal**: Ensure branding styles are **dynamically loaded**.\
**Status**: ✅ Confirmed per client.

### ✅ 4. Load from Thread for Returning Users

**Goal**: Ensure **users can resume conversations** with `Thread_ID`.\
**Status**: ✅ Works with stored IDs.

## Next Steps

### **Phase 1 (Hardcoded Assistants)**

✅ **Ship current Assistants via `index.html` parameter passing.**\
✅ **Finalize and deploy branded BMore Chat & Support Chat.**\
🔲 **Confirm user response handling in Make/AirTable.**

### **Phase 2 (Move to AirTable)**

🔲 **Refactor Lambda to fetch `Assistant_ID` from Airtable, not HTML.**\
🔲 **Store & retrieve `Thread_ID` via Airtable.**\
🔲 **Optimize OpenAI API invocation order in Lambda.**\
🔲 **Handle multiple orgs seamlessly via Airtable records.**

### **Phase 3 (Automated Chat Deployment)**

🔲 **Automate assistant onboarding in Airtable.**\
🔲 **Make UI config in Softr to let clients add new assistants dynamically.**\
🔲 **Expand client usage beyond current test cases.**

## Punch List for UI & Workflow Improvements

🔲 **Improve Intake Form UI**
   - Enhance form layout and readability.
   - Improve error handling and field validation.
   - Optimize mobile responsiveness.

🔲 **Chat Tools for Export & Summary**
   - Add chat export to PDF and CSV.
   - Implement summary generation for chat logs.

🔲 **User & Client-Side Tools for Branding**
   - Allow users to manage `variables.css` dynamically.
   - Provide an option for clients to generate a brand book.

🔲 **Business Analyst Support & Ticketing**
   - Log issues and track customer support requests.
   - Implement Make automation to route tickets to Airtable.
   - Enable customer support to escalate and track recurring issues.

## Recent Updates

### GitHub Pages Integration
- Deployed chat interface to GitHub Pages at `https://integraled.github.io/rag-bmore-app/`
- Configured CORS in Lambda URL settings to allow both:
  - Softr app domain (`https://bmore.softr.app`)
  - GitHub Pages domain (`https://integraled.github.io`)
- Simplified Lambda function by removing redundant CORS headers
- Moved index.html to root for proper GitHub Pages serving

### Lambda Configuration
- Function: `get-pinecone-config`
- Region: `us-east-2`
- Runtime: `nodejs18.x`
- CORS handling: Managed via Lambda URL configuration

## Architecture Flow

┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐
│ Softr App   │────▶│ GitHub Pages    │────▶│ AWS Lambda API  │────▶│ OpenAI API  │
│ Storyline   │     │ (HTML/JS)       │     │ (Node.js 18)    │     │ (Assistant) │
└─────────────┘     └─────────────────┘     └─────────────────┘     └─────────────┘
    │                        │                        │                      │
    │                        │                        │                      │
    │                        │                        │                      │
    ▼                        ▼                        ▼                      │
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐            │
│ User_ID &   │────▶│ URL Parameters  │────▶│ User Permission │            │
│ Organization│     │ (Authentication)│     │ & Save Settings │            │
└─────────────┘     └─────────────────┘     └─────────────────┘            │
                                                    │                       │
                                                    ▼                       │
                                            ┌─────────────────┐            │
                                            │ Make Integration │◀───────────┘
                                            │ (Webhook)        │
                                            └────────┬────────┘
                                                    │
                                                    ▼
                                            ┌─────────────────┐
                                            │ Airtable        │
                                            │ (Data Storage)  │
                                            └────────┬────────┘
                                                    │
                                            ┌───────┴────────┐
                                            │ Template Output │
                                            │ ┌────────────┐ │
                                            │ │Google Drive │ │
                                            │ │  - Slides  │ │
                                            │ │  - PDFs    │ │
                                            │ └────────────┘ │
                                            └───────┬────────┘
                                                   │
                                            ┌──────┴───────┐
                                            │   Future:    │
                                            │  Pinecone    │
                                            │   Vector     │
                                            │   Storage    │
                                            └──────────────┘

## Custom GPT Integration with Softr

### Overview
This project embeds a custom GPT-powered chat interface directly in Softr applications with conversation logging via Make to Airtable, preserving user privacy through ID-based identification.

### Key Components
1. **Lambda Function**: Handles communication with OpenAI's Assistants API
2. **GitHub Pages**: Hosts static assets for the chat interface
3. **Softr Integration**: Embeds the chat interface via HTML component
4. **Make Integration**: Routes conversations to Airtable based on user permissions
5. **Airtable**: Stores conversations and user preferences for future retrieval

### Data Flow & Privacy
- **User Identification**: System uses `User_ID` and `Organization` as primary keys across all components
- **Permission Levels**: Teacher/admin conversations automatically save; student conversations only save with explicit permission
- **Privacy First**: Production environments avoid passing email addresses, especially in educational settings with minors
- **Future Integration**: Airtable `User_Table` will store user preferences (grade level, subject, etc.) that guide prompt inputs

### Setup
1. Deploy the Lambda function with proper environment variables
2. Add the chat interface HTML to a Softr HTML component
3. Pass Softr user context to maintain conversation history
4. Configure Make webhook for conversation routing to Airtable
5. Create appropriate Airtable tables for user data and conversation storage

### User Experience
- Each user gets a persistent conversation thread
- Chat history is maintained between sessions
- The interface is fully embedded in your Softr application
- Conversations are stored anonymously using `User_ID` rather than personally identifiable information
- Future enhancements will personalize responses based on user preferences stored in Airtable

# IntegralEd Central

## Feature Manifest

### MVP Features (Demo Ready)
- [ ] Context-Aware Chat
  - [x] Basic chat interface
  - [x] URL parameter parsing
  - [ ] Document context integration
  - [ ] User recognition

- [ ] Document Upload
  - [ ] Basic file upload
  - [ ] CSV/spreadsheet parsing
  - [ ] Document context extraction

- [ ] User Management
  - [x] URL-based user context
  - [ ] Basic login flow
  - [ ] Organization context

### Future Features
- [ ] Module Directory
  - [ ] Recipe table integration
  - [ ] Dynamic prompt loading
  - [ ] Context override system

- [ ] Integration Tools
  - [ ] Airtable API integration
  - [ ] Make.com CLI support
  - [ ] Webhook management system

### Development Tools
- [ ] CLI Integrations
  - [ ] Airtable data sync
  - [ ] Make.com scenario management
  - [ ] Webhook testing suite

## Dynamic URL Construction and Endpoint Management

### URL Construction Logic

1. **Base Architecture**:
   - The system uses a Lambda endpoint (`https://ctgzczpglrpxybze2jz7iewmjq0wfhcp.lambda-url.us-east-2.on.aws/`) as the central communication point.
   - Each chat interface constructs URLs with specific parameters based on user context.

2. **Parameter Construction**:
   - Core parameters used across all interfaces:
     - `User_ID`: Unique identifier for the user (from Airtable/Softr/anonymous).
     - `Organization`: User's organization or default value.
     - `thread_id`: Chat thread identifier (if exists).

3. **Context Sources**:
   - **Softr Embed**: Gets user data from `Softr.user.get()`.
   - **Direct URL**: Uses URL parameters if provided.
   - **Anonymous Mode**: Falls back to 'anonymous' user if no context.

### JSON Payload Structure

1. **Standard Chat Message**:
   ```json
   {
       "user_id": "string",
       "thread_id": "string|null",
       "organization": "string",
       "timestamp": "ISO-8601 string",
       "metadata": {
           "thread_status": "active|closed",
           "last_interaction": "ISO-8601 string"
       }
   }
   ```

2. **Feedback Message**:
   ```json
   {
       "type": "chat_feedback",
       "message": "string",
       "tenant": "string",
       "domain": "string",
       "source": "URL string",
       "preview": "boolean"
   }
   ```

### Data Detection Points for Make

1. **Entry Points**:
   - New chat initiation.
   - Message sending.
   - Feedback submission.
   - Thread status changes.

2. **Trigger Fields**:
   ```json
   {
     "type": ["chat_message", "chat_feedback"],
     "thread_status": ["active", "closed"],
     "organization": ["Bmore", "Softr", "default"],
     "preview": [true, false]
   }
   ```

3. **State Management**:
   - Thread IDs are stored in `localStorage` with key pattern: `chat_thread_${userId}`.
   - Session persistence handled through browser storage.
   - Server-side state managed through `thread_id` tracking.

This architecture allows for:
- Seamless switching between authenticated and anonymous users.
- Organization-specific routing.
- Preview/production environment separation.
- Centralized webhook handling.
- Flexible feedback collection.
- Thread persistence across sessions.

### Endpoint Management

- The current Lambda endpoint is `https://ctgzczpglrpxybze2jz7iewmjq0wfhcp.lambda-url.us-east-2.on.aws/`.
- All chat interfaces and feedback mechanisms are routed through this endpoint.
- The endpoint is designed to handle both authenticated and anonymous requests, with fallback mechanisms for public access.

### Temporary Public Access Keys

- Consider using a public data store or rotated unlisted invisible table to house "temp public access keys".
- These keys can be offered to users who want to save threads but not identify by email.
- This approach ensures secure and temporary access without compromising user privacy.

# Recursive Learning Platform

## Overview

This platform is designed to provide a multitenant recursive learning environment with chat capabilities tailored for each client.

## MVP Implementation for Bmore

### Setup Instructions

1. **Directory Structure**

   Create dedicated directories for Bmore under the `public/` folder:

   ```plaintext
   public/
   └── bmore/
       ├── css/
       ├── assets/
       └── index.html
   ```

2. **Add Custom Assets**

   Place Bmore's CSS files and assets in their respective directories.

3. **Routing Configuration**

   - Update the routing logic to direct Bmore users to the `/bmore/` endpoints.
   - Ensure that the server correctly serves the Bmore-specific content.

4. **Webhook Integration**

   - Configure webhooks for Bmore's RAG agents.
   - Update the webhook URLs in the configuration files.

### Testing

- Use CURL to test the webhooks:

  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{ "message": "Hello" }' https://yourdomain.com/bmore/webhook
  ```

- Verify responses and ensure correct functioning.

## Expansion to Multitenancy

### Onboarding New Clients

1. **Clone the Template**

   - Copy the `bmore/` folder structure and rename it to the new client's identifier.

     ```bash
     cp -r public/bmore/ public/newclient/
     ```

2. **Customize Assets**

   - Replace CSS and assets with the new client's files.

3. **Update Routing**

   - Add routing rules for the new client in your server configuration.

4. **Configure Webhooks**

   - Set up webhooks specific to the new client's data sources and RAG agents.

### Best Practices

- **Consistency:** Maintain a uniform folder structure for all clients.
- **Scalability:** Keep shared resources modular to facilitate updates across all tenants.
- **Documentation:** Update this README and any relevant documentation when changes are made.

## Fallback Customer Support Assistant

- Integrated as a universal fallback across all clients.
- Handles:

  - Unrecognized queries.
  - Commenting and ticketing issues.

- Ensure it is always accessible and up-to-date.

## Development Workflow

### Branching Strategy

- **`main` Branch:**

  - Contains stable code ready for production.

- **Feature Branches:**

  - Use feature branches for development (`feature/feature-name`).

### Testing

- Regularly test integrations using CURL and other tools.
- Implement automated tests where possible.

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run the Server**

   ```bash
   npm start
   ```

3. **Access the Application**

   - Navigate to `https://yourdomain.com/bmore/` for Bmore's chat interface.

## Contributing

- Please follow the code style guidelines.
- Submit pull requests for review before merging.

## License

- This project is proprietary and confidential.

## Data Privacy and SIS Compliance

- **Anonymity:** The platform uses `Record_ID` and `Org_ID` to identify users anonymously.
- **No Email Storage:** Email addresses and names are not stored or transmitted.
- **Compliance:** The system complies with FERPA regulations and other student privacy laws.

## URL Construction and Routing Logic

- **URL Parameters:**

  ```
  ?User_ID=-----&Org_ID=-----&Thread_ID=-----&Source=chat&Action_ID=-----
  ```

- **Frontend Implementation:**
  - The chat interface constructs the `LAMBDA_URL` with the above parameters.
  - `Action_ID` corresponds to the specific assistant or action to be performed.
  - `Org_ID` represents the client's organization ID, used for context and configurations.

- **Lambda Functions:**
  - AWS Lambda functions parse these query parameters.
  - Retrieve context and variables from Airtable based on `Action_ID`.
  - Data flow is managed without exposing personal identifiers.

## Client Configuration Variables

- **Organizational Information:**
  - `Org_ID`, `Client_Name`, `Client_Slug`

- **Branding:**
  - Colors: `Client_HEX_Primary`, `Client_HEX_Secondary`, `Client_HEX_Accent`, `Client_HEX_Background`, `Client_HEX_Text`

- **Typography:**
  - Fonts: `Client_Font_H1`, `Client_Font_H2`, `Client_Font_Body`
  - Font Sizes: `Client_Font_Size_H1`, `Client_Font_Size_H2`, `Client_Font_Size_Body`

- **Assets:**
  - URLs for logos, icons, and images

- **Layout:**
  - Spacing, border radii, padding

- **Accessibility:**
  - Settings for font scale and contrast modes

- **Support:**
  - Contact information for client support

## Onboarding a New Client

### Additional Steps:

1. **Update Client Configuration:**
   - Include all the new variables in `client-config.json`
   - Ensure that asset URLs are correctly pointed to the client's assets

2. **Customize CSS Variables:**
   - Generate `variables.css` based on the client's branding configurations

3. **Ensure Accessibility Settings:**
   - Verify that accessibility options are properly configured and functioning

## Utilizing Softr Forms for Client Intake

- **Collect Additional Branding Information:**
  - Include fields for all new variables in the form
  - Ensure clients can upload assets and provide URLs if needed

- **Automate Variable Integration:**
  - Use integration tools to automatically update `client-config.json` and stylesheets with the information from Airtable

## Generating a Brand Book

- **Enhanced Template:**
  - Include sections for all new configurations
  - Display visual representations of colors, fonts, and layouts

- **Automation:**
  - Update the document generation process to pull in all new variables

### BHB Client Chat Integration

- **Chat Bubble:** A chat bubble is displayed on the BHB site, allowing users to initiate a chat with the Business Analyst assistant.
- **Script Location:** `/docs/clients/BHB/assets/js/min.js`
- **Functionality:** Opens a new tab with the chat interface when clicked.
- **Accessibility:** Includes `aria-label` for screen readers.
- **Styling:** Features hover effects for improved user interaction.
- **Error Handling:** Basic error handling for URL loading issues.

## Current Progress

### MVP Chat Implementation
- Integrated the Assistant API to manage ongoing conversations using threads.
- Implemented logic to create new threads or continue existing ones based on `Thread_ID`.
- Enhanced error handling and logging for better debugging and monitoring.
- Preparing for integration with Make and Airtable for asynchronous context building and LRS backend support.

### Next Steps
- Continue testing the Lambda function with various payloads to ensure robust thread management.
- Finalize integration with Make and Airtable to support multitenant systems.
- Iterate on feedback and refine the chat experience for the MVP release.




## Jekyll Setup and Deployment

### Overview

Our platform uses Jekyll to manage and deploy client-specific chat interfaces. This approach allows for modular and reusable components, making it easy to maintain and scale.

### Directory Structure

- **shared_jekyll/**: Contains shared layouts, includes, and assets used across all client sites.
- **clients/**: Each client has a dedicated directory with specific configurations and pages.

### Key Components

1. **Layouts and Partials**
   - **_layouts/**: Defines the overall structure of pages.
   - **_includes/**: Contains reusable components like headers, footers, and sidebars.

2. **Configuration**
   - **_config.yml**: Central configuration file for Jekyll, specifying directories and plugins.
   - **CNAME**: Custom domain configuration for GitHub Pages.

3. **Deployment**
   - **GitHub Pages**: Automatically builds and serves the site from the specified branch.
   - **Custom Domain**: Configured via the CNAME file and GitHub Pages settings.

### Deployment Process

1. **Local Development**
   - Run Jekyll locally to test changes before deployment.
   - Use `bundle exec jekyll serve` to start the local server.

2. **Commit and Push**
   - Make changes to the content or configuration.
   - Commit changes and push to the main branch to trigger a rebuild.

3. **Accessing the Site**
   - The site is accessible at `https://recursivelearning.app/clients/<client-name>/chat.html`.

### Benefits

- **Modularity**: Easily manage and update shared components.
- **Scalability**: Quickly onboard new clients with minimal setup.
- **Customization**: Client-specific configurations allow for tailored experiences.

This setup streamlines the deployment process and ensures consistency across all client sites.