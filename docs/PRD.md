📝 Product Requirements Document: DevVault

Project Name: DevVault (The Developer's Second Brain)

Platform: Web (React/Next.js) & Mobile (Flutter)

Deadline: 15 มีนาคม 2569 (เหลือเวลาอีก 10 วัน) 
1. Objective & Target Audience
สร้างคลังเก็บ Code Snippets และ React Components ส่วนตัวที่สามารถรันพรีวิวได้จริง เพื่อให้นักพัฒนาสามารถนำโค้ดกลับมาใช้ซ้ำ (Reuse) ได้อย่างรวดเร็ว รองรับการจัดระเบียบแบบโฟลเดอร์ และกำหนดความเป็นส่วนตัวเพื่อแบ่งปันในชุมชนนักพัฒนา 

2. Core Features (Functional Requirements)
2.1 Code Snippet Manager (The Sandbox)

    - Split-View Editor: ฝั่งซ้ายเป็น Code Editor (แนะนำใช้ Library: Monaco Editor หรือ CodeMirror) ฝั่งขวาเป็น Live Preview 

    - Sandbox Environment: ใช้ Library เช่น Sandpack (โดย CodeSandbox) เพื่อรันโค้ดใน Browser Sandbox ที่แยกจาก Server หลักเพื่อความปลอดภัย 

    - Real-time / Manual Run: รองรับทั้งการอัปเดตพรีวิวทันทีเมื่อพิมพ์ หรือกดปุ่ม 'Run' เพื่อประมวลผล 

    - Recursive Folder System: ระบบจัดการโฟลเดอร์ที่ซ้อนกันได้ไม่จำกัด เพื่อแยกโปรเจกต์หรือประเภทของ Component (เช่น Project A > UI > Buttons) 

    - Visual Gallery List: หน้าแรกแสดง Snippets ในรูปแบบ Card ที่มี Thumbnail LivePreview (Render ขนาดเล็ก) เพื่อให้สแกนหา Component ได้ด้วยตา 

2.2 Auth & Social Privacy System

    - Identity Management: ระบบสมัครสมาชิกและเข้าสู่ระบบด้วย JWT (JSON Web Token) ผ่าน HttpOnly Cookie 

    - Privacy Levels (RBAC): 

        Private: เห็นและใช้งานได้เฉพาะเจ้าของ (Default).

        Friends Only: เห็นเฉพาะผู้ใช้ที่กดยอมรับเป็นเพื่อน (Social Graph).

        Public: เปิดเป็นสาธารณะให้ทุกคนสามารถ Copy หรือเรียนรู้โค้ดได้.

    - Social Connectivity: ระบบติดตาม (Follow) หรือเพิ่มเพื่อนเพื่อสร้างเครือข่ายนักพัฒนา 

3. Technical Stack & Architecture

เพื่อให้ได้รับคะแนนเต็มในส่วน Concept & Architecture (10%):

    Frontend (Web): React / Next.js + HeroUI + Tailwind CSS (เน้น Glassmorphism) (รองรับ Offline Queue สำหรับจดไอเดียตอนไม่มีเน็ต)

    Mobile: Flutter (มีแค่ Visual Gallery List ดู code และ copy ได้อย่างเดียว ไม่มี Split-View Editor เหมือน version WWeb)

    Backend: Node.js + Express (พร้อมระบบ Circuit Breaker และ API Monitoring) 

    Database: MongoDB (เก็บข้อมูลความสัมพันธ์แบบ 2 Collections และทำ Aggregation Pipeline สำหรับสถิติ)