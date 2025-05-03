![image](https://github.com/user-attachments/assets/0a50f47f-1f1d-48b7-9424-4340909385ef)

---

## **Tracko: Where Ideas Meet Action**

Tracko is built for teams who believe great ideas deserve more than sticky notes and scattered chats. It transforms brainstorming into a structured, collaborative process by merging intelligent ideation tools with project management workflows — all in one platform.

Forget switching between disconnected tools. With Tracko, your team can:

-   **Brainstorm with AI Assistance**: Use Claude AI to generate, expand, and refine ideas in real-time — perfect for getting past creative blocks and exploring new directions.
    
-   **Capture and Evolve Ideas**: Turn raw thoughts into actionable plans with structured discussion threads tied directly to each idea.
    
-   **Vote to Align Quickly**: Build consensus without bottlenecks through integrated democratic voting, ensuring everyone has a voice.
    
-   **Chat with Purpose**: Engage in focused conversations that stay organized by project and context — no more lost ideas in group chats.
    
-   **Summarize Project**: At any stage, get a clear, AI-generated summary of your team's current thinking and progress — always in sync with the project’s evolving state.
    

Designed for creative teams, students, and agile collaborators, Tracko is your single space for idea generation, evaluation, and execution — from the first spark to the final deliverable.

---

## **Technologies**  
| Category             | Tech Stack                                                               |
|----------------------|--------------------------------------------------------------------------|
| **Core Framework**   | Next.js + React 18                                     |
| **Styling**          | Tailwind CSS + MagicUI + Custom CSS                                      |
| **State Management** | React Hooks + Context API                                                |
| **UI Components**    | Radix UI + Lucide React                                           ||
| **API & Backend**    | [Tracko server](https://github.com/johndonneUZH/sopra-fs25-group-46-server) |
| **Real-Time**        | Supabase                |
| **Hosting**          | Vercel (build, preview, and deploy)                                      
| **Package Management** | npm                                                                   |

---

## **Launch & Deployment**  

### **Prerequisites**  
- Node.js v18+  
- Tracko Server running ([setup guide](https://github.com/johndonneUZH/sopra-fs25-group-46-server))  
---


### **1. Clone & Install**  
```bash
git clone https://github.com/johndonneUZH/sopra-fs25-group-46-client.git
cd sopra-fs25-group-46-client
npm install
```

### **2. Configure Environment**  

#### **For Local Development**

Create  `.env.local`  in the project root with:

```env
# API Configuration
NEXT_PUBLIC_PROD_API_URL=http://localhost:8080/api  # Local server
NODE_ENV=development

# Supabase 
NEXT_PUBLIC_SUPABASE_URL=link-to-your-supabase-project
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-api-key
```
#### **For Production**

```env
NEXT_PUBLIC_PROD_API_URL=your-server-url
NODE_ENV=production
```

### **3. Run Locally**  
```bash
npm run dev  # Starts at http://localhost:3000
```
---

## **Walkthrough & Screenshots**  

### **1. Onboarding**  
![image](https://github.com/user-attachments/assets/2c4705e9-fdff-4883-8c1a-1d4ee3d93a23)

### **2. Sign in/up**  
![image](https://github.com/user-attachments/assets/6da5b11d-413b-48d7-9e73-fe55754a2bd7)

### **3. Creating a Project**  
![image](https://github.com/user-attachments/assets/f904cd63-83ef-4569-b210-60a1e09a7eb9)


### **4. Idea Exploration**  
![image](https://github.com/user-attachments/assets/3f31e985-6dea-470b-93aa-209cc20beee5)
 

### **5. Projects**  
![image](https://github.com/user-attachments/assets/0563e0b9-28ef-4d91-9c6a-85ed4fa78e71)
 

### **6. Changelog**  
![image](https://github.com/user-attachments/assets/0d87f5a4-1ea1-418c-812e-db58b77ae61e)
---
## Docker

Ensure that [Docker](https://www.docker.com/) is installed on your machine.

### Pull the image

```docker pull johndonneuzh/sopra-group-46-client```

### Run the container

```docker run -p 3000:3000 johndonneuzh/sopra-group-46-client```

---

## Authors and acknowledgment

-   [Matteo Adam](https://github.com/johndonneUZH)
-   [Miguel Vite](https://github.com/JMAVITE)
-   [Manuel Tuor](https://github.com/manueltuor)
-   [Ronald Domi](https://github.com/RonaldDomi)
-   [Fabio Di Meo](https://github.com/fabiotilor)

We thank [Youssef Farag](https://github.com/Figo2003) for his guidance and knowledge, as well as all teaching assistants of the module Software Engineering at the University of Zurich for their feedback and considerations on our project.


