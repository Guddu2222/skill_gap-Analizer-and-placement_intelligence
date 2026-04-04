# System Architecture Diagrams
## Skill Gap Analyser & Placement Intelligence Platform

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        S[Student Browser]
        C[College Browser]
        R[Recruiter Browser]
    end
    
    subgraph "Frontend - React + Vite"
        LP[Landing Page]
        AUTH[Login/Register]
        SD[Student Dashboard]
        CD[College Dashboard]
        RD[Recruiter Dashboard]
        SI[Skill Intelligence]
        AN[Alumni Network]
        IP[Interview Prep]
        CRM[Recruiter CRM]
        SS[Smart Shortlist]
    end
    
    subgraph "Backend - Express.js"
        API[API Gateway]
        JWT[JWT Middleware]
        
        subgraph "Route Controllers"
            AuthR[Auth Routes]
            JobR[Job Routes]
            StdR[Student Routes]
            CollR[College Routes]
            RecR[Recruiter Routes]
            AnalR[Analytics Routes]
        end
        
        subgraph "Business Logic"
            SGA[Skill Gap Analysis]
            CGA[Curriculum Gap]
            ARS[At-Risk Detection]
            OPP[Offer Prediction]
            SCH[Auto Scheduling]
        end
    end
    
    subgraph "Database - MongoDB"
        USER[(User Collection)]
        STD[(Student Collection)]
        ALM[(Alumni Collection)]
        JOB[(Job Collection)]
        APP[(Application Collection)]
        INT[(Interview Experience)]
    end
    
    S --> LP
    C --> LP
    R --> LP
    
    LP --> AUTH
    AUTH --> SD
    AUTH --> CD
    AUTH --> RD
    
    SD --> SI
    SD --> AN
    SD --> IP
    
    CD --> CRM
    
    RD --> SS
    
    SI --> API
    AN --> API
    IP --> API
    CRM --> API
    SS --> API
    
    API --> JWT
    JWT --> AuthR
    JWT --> JobR
    JWT --> StdR
    JWT --> CollR
    JWT --> RecR
    JWT --> AnalR
    
    StdR --> SGA
    CollR --> CGA
    CollR --> ARS
    RecR --> OPP
    RecR --> SCH
    
    AuthR --> USER
    JobR --> JOB
    StdR --> STD
    StdR --> ALM
    StdR --> INT
    CollR --> STD
    CollR --> JOB
    RecR --> STD
    RecR --> JOB
    AnalR --> APP
    
    SGA --> STD
    SGA --> JOB
    CGA --> STD
    CGA --> JOB
    ARS --> STD
    OPP --> STD
    SCH --> APP
    
    style S fill:#4A90E2
    style C fill:#4A90E2
    style R fill:#4A90E2
    style API fill:#50C878
    style JWT fill:#F39C12
    style USER fill:#FFD700
    style STD fill:#FFD700
    style ALM fill:#FFD700
    style JOB fill:#FFD700
    style APP fill:#FFD700
    style INT fill:#FFD700
```

---

## 2. Database Schema & Relationships

```mermaid
erDiagram
    User ||--o| Student : has
    User ||--o{ Job : posts
    Student ||--o{ Application : submits
    Job ||--o{ Application : receives
    Student }o--o{ Alumni : connects_with
    
    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum role
        date createdAt
    }
    
    Student {
        ObjectId _id PK
        ObjectId user FK
        string rollNumber UK
        string department
        number year
        number cgpa
        array skills
        string targetRole
        array dreamCompanies
        string resume
        enum placementStatus
        array applications FK
    }
    
    Alumni {
        ObjectId _id PK
        string name
        string company
        string role
        number batch
        string department
        string linkedInProfile
        string email
        array skills
        boolean isMentor
        date createdAt
    }
    
    Job {
        ObjectId _id PK
        string company
        string title
        string description
        string location
        string salary
        enum jobType
        array requirements
        date deadline
        ObjectId postedBy FK
        array applicants FK
        date createdAt
    }
    
    Application {
        ObjectId _id PK
        ObjectId job FK
        ObjectId student FK
        enum status
        date appliedAt
    }
    
    InterviewExperience {
        ObjectId _id PK
        string company
        string role
        string round
        array questions
        string difficulty
        string tips
        ObjectId postedBy FK
        date createdAt
    }
```

---

## 3. Student Skill Gap Analysis Flow

```mermaid
sequenceDiagram
    actor Student
    participant UI as React Frontend
    participant API as Express API
    participant Auth as JWT Middleware
    participant Route as Student Routes
    participant Logic as Skill Gap Logic
    participant DB as MongoDB
    
    Student->>UI: Navigate to Skill Intelligence
    UI->>API: GET /api/student-features/skill-gap
    Note over UI,API: Authorization: Bearer <JWT>
    
    API->>Auth: Verify JWT Token
    Auth->>Auth: Extract userId from token
    Auth-->>API: req.user = {userId}
    
    API->>Route: Forward to skill-gap handler
    Route->>DB: Find Student by userId
    DB-->>Route: Student {skills, targetRole}
    
    Route->>Logic: Analyze Skill Gap
    Note over Logic: 1. Get target role requirements<br/>2. Compare with student skills<br/>3. Calculate match score
    
    Logic->>Logic: requiredSkills = roleSkills[targetRole]
    Logic->>Logic: gaps = required - student.skills
    Logic->>Logic: score = (acquired / required) * 100
    
    Logic-->>Route: Analysis Result
    Route-->>API: JSON Response
    API-->>UI: {targetRole, matchScore, missingSkills, acquiredSkills}
    
    UI->>UI: Render Charts with Recharts
    UI-->>Student: Display Skill Gap Dashboard
```

---

## 4. College Curriculum Gap Analysis Flow

```mermaid
sequenceDiagram
    actor Admin as College Admin
    participant UI as React Frontend
    participant API as Express API
    participant Route as College Routes
    participant DB as MongoDB
    
    Admin->>UI: Navigate to College Dashboard
    UI->>API: GET /api/college-features/curriculum-gap
    
    API->>Route: curriculum-gap handler
    
    par Fetch Market Demand
        Route->>DB: Find all Jobs
        DB-->>Route: Jobs with requirements[]
    and Fetch Student Supply
        Route->>DB: Find all Students
        DB-->>Route: Students with skills[]
    end
    
    Route->>Route: Aggregate Market Demand
    Note over Route: Count frequency of each skill<br/>in job requirements
    
    Route->>Route: Aggregate Student Supply
    Note over Route: Count frequency of each skill<br/>in student profiles
    
    Route->>Route: Calculate Gap Analysis
    Note over Route: gap = demandCount - supplyCount<br/>for each skill
    
    Route->>Route: Identify Critical Gaps
    Note over Route: Filter: high demand + low supply<br/>(supply < demand * 0.5)
    
    Route-->>API: {overview, criticalGaps}
    API-->>UI: JSON Response
    
    UI->>UI: Render Charts
    UI-->>Admin: Display Top Skills + Critical Gaps
```

---

## 5. Recruiter Offer Acceptance Prediction Flow

```mermaid
flowchart TD
    Start([Recruiter Selects Candidate]) --> Input[Enter Offer Details:<br/>CTC, Location]
    Input --> API[POST /api/recruiter-features/offer-probability]
    
    API --> FetchStudent[Fetch Student Profile<br/>from MongoDB]
    FetchStudent --> BaseProb[Set Base Probability = 70%]
    
    BaseProb --> CheckCTC{Offer CTC vs<br/>Expected CTC?}
    CheckCTC -->|Below Expectation| DecreaseCTC[Probability -= 20%<br/>Add Risk: Below Expectation]
    CheckCTC -->|Above 1.5x| IncreaseCTC[Probability += 15%]
    CheckCTC -->|Normal| NextCheck1[Continue]
    
    DecreaseCTC --> CheckLocation
    IncreaseCTC --> CheckLocation
    NextCheck1 --> CheckLocation
    
    CheckLocation{Location Match<br/>Preferences?}
    CheckLocation -->|No Match| DecreaseLoc[Probability -= 15%<br/>Add Risk: Location Mismatch]
    CheckLocation -->|Match| NextCheck2[Continue]
    
    DecreaseLoc --> CheckOffers
    NextCheck2 --> CheckOffers
    
    CheckOffers{Has Competing<br/>Offers?}
    CheckOffers -->|Yes| DecreaseOffer[Probability -= 25%<br/>Add Risk: Competing Offers]
    CheckOffers -->|No| NextCheck3[Continue]
    
    DecreaseOffer --> CapProb
    NextCheck3 --> CapProb
    
    CapProb[Cap Probability<br/>between 10-99%]
    
    CapProb --> ClassifyRisk{Final<br/>Probability?}
    ClassifyRisk -->|< 50%| HighRisk[Risk Level: HIGH]
    ClassifyRisk -->|50-80%| MedRisk[Risk Level: MEDIUM]
    ClassifyRisk -->|> 80%| LowRisk[Risk Level: LOW]
    
    HighRisk --> Response
    MedRisk --> Response
    LowRisk --> Response
    
    Response[Return Prediction:<br/>probability, riskLevel, riskFactors]
    Response --> Display([Display in Recruiter Dashboard])
    
    style Start fill:#4A90E2
    style Input fill:#E8F4F8
    style HighRisk fill:#E74C3C
    style MedRisk fill:#F39C12
    style LowRisk fill:#50C878
    style Display fill:#4A90E2
```

---

## 6. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as React App
    participant API as /api/auth
    participant DB as MongoDB
    participant JWT as JWT Service
    
    User->>UI: Enter credentials
    UI->>API: POST /api/auth/login<br/>{email, password}
    
    API->>DB: Find User by email
    
    alt User Not Found
        DB-->>API: null
        API-->>UI: 404 User not found
        UI-->>User: Show error message
    else User Found
        DB-->>API: User document
        
        API->>API: Compare password hash<br/>using bcryptjs
        
        alt Invalid Password
            API-->>UI: 401 Invalid credentials
            UI-->>User: Show error message
        else Valid Password
            API->>JWT: Generate Token
            Note over JWT: Payload: {userId, role}<br/>Secret: process.env.JWT_SECRET<br/>Expiry: 7 days
            
            JWT-->>API: JWT Token
            API-->>UI: {token, user: {id, name, email, role}}
            
            UI->>UI: Store token in localStorage
            UI->>UI: Redirect to role-based dashboard
            UI-->>User: Show dashboard
            
            Note over UI: All subsequent API calls include:<br/>Authorization: Bearer <token>
        end
    end
```

---

## 7. At-Risk Student Detection Flow

```mermaid
flowchart TD
    Start([Trigger: College Admin<br/>Views At-Risk Radar]) --> Request[GET /api/college-features/at-risk]
    
    Request --> Fetch[Fetch all Unplaced Students<br/>from MongoDB]
    Fetch --> Loop{For each<br/>student}
    
    Loop -->|Process| Init[Initialize:<br/>riskFactors = []<br/>riskLevel = null]
    
    Init --> CheckCGPA{CGPA < 7?}
    CheckCGPA -->|Yes| AddCGPA[Add 'Low CGPA'<br/>to riskFactors]
    CheckCGPA -->|No| CheckSkills
    
    AddCGPA --> CheckSkills
    CheckSkills{Skills count<br/>< 3?}
    CheckSkills -->|Yes| AddSkills[Add 'Low Skill Count'<br/>to riskFactors]
    CheckSkills -->|No| CheckApps
    
    AddSkills --> CheckApps
    CheckApps{Applications<br/>> 10?}
    CheckApps -->|Yes| AddApps[Add 'High Rejection Rate'<br/>to riskFactors]
    CheckApps -->|No| Classify
    
    AddApps --> Classify
    Classify{riskFactors<br/>length >= 2?}
    Classify -->|Yes| Critical[riskLevel = 'Critical']
    Classify -->|No, but > 0| Moderate[riskLevel = 'Moderate']
    Classify -->|0 factors| Skip[Skip student]
    
    Critical --> AddToList
    Moderate --> AddToList
    AddToList[Add to atRiskList]
    
    AddToList --> Loop
    Skip --> Loop
    
    Loop -->|All processed| Sort[Sort by riskLevel<br/>Critical first]
    Sort --> Response[Return atRiskList<br/>with student details]
    Response --> Display([Display in UI<br/>with action buttons])
    
    style Start fill:#4A90E2
    style Critical fill:#E74C3C
    style Moderate fill:#F39C12
    style Display fill:#50C878
```

---

## 8. Job Application Process Flow

```mermaid
sequenceDiagram
    actor Student
    participant UI as Student Dashboard
    participant JobAPI as /api/jobs
    participant Auth as JWT Middleware
    participant DB as MongoDB
    
    Student->>UI: Browse available jobs
    UI->>JobAPI: GET /api/jobs
    JobAPI->>DB: Find all active jobs
    DB-->>JobAPI: Jobs array
    JobAPI-->>UI: Display job listings
    
    Student->>UI: Click 'Apply' on job
    UI->>UI: Show confirmation dialog
    Student->>UI: Confirm application
    
    UI->>JobAPI: POST /api/jobs/:jobId/apply<br/>Headers: Authorization Bearer token
    
    JobAPI->>Auth: Verify JWT
    Auth->>Auth: Extract userId
    Auth-->>JobAPI: Authenticated user
    
    JobAPI->>DB: Find Student by userId
    DB-->>JobAPI: Student document
    
    JobAPI->>DB: Check if already applied
    Note over DB: Query: Application.find({<br/>  student: studentId,<br/>  job: jobId<br/>})
    
    alt Already Applied
        DB-->>JobAPI: Existing application
        JobAPI-->>UI: 409 Already applied
        UI-->>Student: Show 'Already Applied' message
    else New Application
        DB-->>JobAPI: null (no existing application)
        
        JobAPI->>DB: Create new Application
        Note over DB: {<br/>  job: jobId,<br/>  student: studentId,<br/>  status: 'applied'<br/>}
        
        par Update References
            JobAPI->>DB: Push application to Job.applicants[]
        and
            JobAPI->>DB: Push application to Student.applications[]
        end
        
        DB-->>JobAPI: Success
        JobAPI-->>UI: 201 Application submitted
        
        UI->>UI: Update button to 'Applied'
        UI->>UI: Add to 'My Applications' list
        UI-->>Student: Show success notification
    end
```

---

## 9. Complete User Journey Map

```mermaid
journey
    title Student Journey - From Registration to Placement
    section Registration
      Visit Platform: 5: Student
      Create Account: 4: Student
      Login: 5: Student
    section Profile Setup
      Complete Profile: 3: Student
      Add Skills: 4: Student
      Upload Resume: 3: Student
      Set Dream Companies: 5: Student
    section Skill Development
      View Skill Gap: 5: Student
      Identify Missing Skills: 4: Student
      Access Resources: 3: Student
      Update Skills: 4: Student
    section Networking
      Browse Alumni: 5: Student
      Connect with Mentors: 4: Student
      Read Interview Experiences: 5: Student
    section Job Application
      Browse Jobs: 5: Student
      Apply to Jobs: 4: Student
      Track Applications: 3: Student
    section Interview
      Receive Shortlist: 4: Student
      Prepare for Interview: 3: Student
      Attend Interview: 2: Student
    section Placement
      Receive Offer: 5: Student
      Accept Offer: 5: Student
      Update Status: 4: Student
```

---

## Legend

### Colors
- 🟦 **Blue**: User/Client interactions
- 🟩 **Green**: Successful operations
- 🟨 **Yellow**: In-progress/Moderate
- 🟥 **Red**: High risk/Critical
- 💛 **Gold**: Database entities

### Abbreviations
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **CRM**: Customer Relationship Management
- **ROI**: Return on Investment
- **SDE**: Software Development Engineer
- **CGPA**: Cumulative Grade Point Average
