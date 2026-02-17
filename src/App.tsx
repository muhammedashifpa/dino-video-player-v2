
import Layout from './components/Layout';
import Header from './components/Header';
import CategoryPills from './components/CategoryPills';
import VideoCard, { type VideoCardProps } from './components/VideoCard';
import BottomNav from './components/BottomNav';

const dummyVideos: VideoCardProps[] = [
  {
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBohMWFs5d3vBT4fkmSHyvFADGPG-8GhWz7kKhLaru1HjXL32GEqmrBiOpqH2dOb_qRVZo569HtrXzZnXLWYJ2hqOnw26t2heBmEJaAm9cQLciGNOzVkJtKRpVqaZhvv2Xwz0E3c3fLj95usZAleXlxbj-GStgMwByL3nI3VxMk9Jx5MjKxC-4FGbxI9rP9l1En1GlncC6AGGVkcPQGsJ_7Nb5YR9xfCPO7Xd2TO1IYYPl_K_VgDPmG5AGKw1YPFpwn6fzFQOsrGT9x',
    duration: '14:22',
    channelAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkiIu9KNl5vXRVnimo420mieAKmSRbvd2Az3VGK3Hv58SCE7ztvgFOXfcpf5hHm7Hl4ZwpyzODgjs-ChgSkMHQL8JZb-TUnGZIQE_RmZmH7VMDXObPiCntqwNbgHMNxbdzmM__c6q_sVMBhQ16YfA0F2phRI77p0PMU2wJ09jcSiDVHDFpKekZGBiiBO30MVKth_TcayuA_XVYdTeuN87IRTqHy_zoVG6XiM98P_AtzP8VYisRTbJGQ0TKz6LfDDQKyNAoa49YN84O',
    title: 'How AI is changing Social Media forever: The New Era of Content',
    channelName: 'Dino AI Labs',
    views: '1.2M views',
    uploadedAt: '2 days ago',
  },
  {
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEt87M2WPlpfLbkxgXISQQHjZ6WNnt4zZAJ7KaCnMhzWGL3zqbvq46qgqrgV6bsnAh0lbzyzc6pozGJ-kfQJe6BM8aoShVzCIN_RdZB4ZhBPyuZzLJPEWbN5UwSD38kK-ASkrrIEJ5y__p3XnPpFPg78X2JUCzo1mc0CJspEnPPoGXEKFm-xxaONWkJ9C0TFiqdLAn0UOXla0OAI7oUWeLCGlEf-dRZtGehVRc4ykgRvEG3_RrsKrWe9Uu7TsXwWbi5EWgRX15prfS',
    duration: '08:45',
    channelAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWeqIj9ljOBMkcGvuamd-rB5y2wLN8udgJDN03GBalz3g0b1j1G1BWFdb5zBhOvLja4fVuCSpjSJNXAF-P1PrClGY-aKXOhNYqMgNvkQK7kyePAhnyhZ3iqcpVYGjetKZIlc73a6eUGtBOX_hcOT-Q2YBayvK82qeq3cquUpSMBZWFAjL7jQu4wHoHaoC-WU7Y6F4LjwrxaVZjpC-VRXRJMlNsjFatOQbY42r3G0axp41KxOCNV8j0pOHE7rSgomoIqN9LrDxbygwR',
    title: 'Top 5 AI Income Streams to Start in 2024 (Passive & Active)',
    channelName: 'Future Wealth',
    views: '850K views',
    uploadedAt: '5 hours ago',
  },
  {
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjAz1SWabhvSPrXRBo6_fZRbGr1WinwRW6cpP22-2vAwuGDPvECYOFAhyz6kx1zEjB9cfGtFIohfzV91_aoGHOYblyHbkkKqwjQL4xKG57eqW8y90_xFovmRJCwSnV8tSk4GCtiC8XgYG-l8UPyuKXBDu_eoHo7MhlJVpBOEiVsu8hCQ-qnwJTqODn4QjiyQwyfqW40i5b9q-dmvbN1DwLttsnl6vU8gY4ztQkoMRIEEKi99jsmuJxaJBg7f0hEvYSK8H5HYtPicQv',
    duration: '01:03:00',
    channelAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLmfgZYWj9Q9df0_8AVqCzDbhC_MpjyQSXo_nwBodQJcKaS_j8HBLw6zfoNCZWJ_yVhhcfJ22bgkpBmCgH3jZNG8R-0duu_7zIi8SgYSJoB1WUDWZ1ifazL1Gv-BnOuZODL_IGTLq-ZriJG3ACriEBMM0OzvyLUD_b_aOFNINWjJCL2o3GbpnBDo4c9gseN1FLieHUCW1WTeqevSGvqY_u5u8ePv_IoK6eol0Ae9IEOEe-tCQn2TQ7a51z3NqOoZ-wSZ9F6BLb1noD', // Reuse user profile for now or placeholder
    title: 'Full Stack Development Full Course 2024 | 10 Hours',
    channelName: 'Code Master',
    views: '2.1M views',
    uploadedAt: '1 week ago',
  },
];

function App() {
  return (
    <Layout>
      <Header />
      <CategoryPills />
      <main className="flex-1 overflow-y-auto pb-32">
        {dummyVideos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </main>
      <BottomNav />
    </Layout>
  );
}

export default App;
