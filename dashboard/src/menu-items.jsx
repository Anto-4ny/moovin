// ==============================|| ICON IMPORTS ||============================== //
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

const icons = {
  NavigationOutlinedIcon,
  HomeOutlinedIcon,
  AccountTreeOutlinedIcon,
  AppsOutlinedIcon,
  ContactSupportOutlinedIcon,
  InfoOutlinedIcon,
  HomeWorkOutlinedIcon,
  TrackChangesOutlinedIcon,
  BuildOutlinedIcon,
  DomainAddOutlinedIcon,
  EditOutlinedIcon,
  DashboardOutlinedIcon,
  LogoutIcon
};

// ==============================|| COMMON MENU ||============================== //

const commonPages = [
  {
    id: 'home',
    title: 'Home',
    type: 'item',
    icon: icons.HomeOutlinedIcon,
    url: 'https://moovin-eight.vercel.app/index',
    external: true,
    iconColor: 'black'
  },
  {
    id: 'about',
    title: 'About',
    type: 'item',
    icon: icons.InfoOutlinedIcon,
    url: 'https://moovin-eight.vercel.app/about',
    external: true,
    iconColor: 'blue'
  },
  {
    id: 'services',
    title: 'Services',
    type: 'item',
    icon: icons.AppsOutlinedIcon,
    url: '#',
    external: true,
    iconColor: 'black'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    type: 'item',
    icon: icons.ContactSupportOutlinedIcon,
    url: 'https://moovin-eight.vercel.app/contact',
    iconColor: 'blue'
  },
  {
    id: 'book-repair',
    title: 'Book Repair(s)',
    type: 'item',
    icon: icons.BuildOutlinedIcon,
    url: '/dashboard/professionals-directory',
    iconColor: 'blue'
  },
  {
    id: 'apply-repairer',
    title: 'Apply as Repairer',
    type: 'item',
    icon: icons.BuildOutlinedIcon,
    url: '/dashboard/professionals-application',
    iconColor: 'brown'
  }
];

// ==============================|| TENANT PAGES ||============================== //

const tenantPages = [
  {
    id: 'tenant-dashboard',
    title: 'Tenant Dashboard',
    type: 'item',
    icon: icons.NavigationOutlinedIcon,
    url: '/dashboard/tenant',
    iconColor: 'blue'
  },
  {
    id: 'book-property',
    title: 'Purchase or Rent Property',
    type: 'item',
    icon: icons.HomeWorkOutlinedIcon,
    url: '/dashboard/book-property',
    iconColor: 'black'
  }
];

// ==============================|| LANDLORD PAGES ||============================== //

const landlordPages = [
  {
    id: 'landlord-dashboard',
    title: 'Landlord Dashboard',
    type: 'item',
    icon: icons.DashboardOutlinedIcon,
    url: '/dashboard/landlord',
    iconColor: 'green'
  },
  {
    id: 'add-property',
    title: 'Add Property',
    type: 'item',
    icon: icons.DomainAddOutlinedIcon,
    url: '/dashboard/add-property',
    iconColor: 'black'
  },
  {
    id: 'edit-property',
    title: 'Edit Property',
    type: 'item',
    icon: icons.EditOutlinedIcon,
    url: '/dashboard/edit-property/:id', 
    iconColor: 'red'
  },
  {
    id: 'manage-property',
    title: 'Manage Properties',
    type: 'item',
    icon: icons.BuildOutlinedIcon,
    url: '/dashboard/manage-property',
    iconColor: 'black'
  }
];

// ==============================|| ADMIN PAGES ||============================== //

const adminPages = [
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    type: 'item',
    icon: icons.DashboardOutlinedIcon,
    url: '/dashboard/admin',
    iconColor: 'blue'
  },
  ...landlordPages,
  ...tenantPages
];

// ==============================|| MENU BY ROLE ||============================== //

const getMenuItemsByRole = (role) => {
  let pages = [];

  switch (role) {
    case 'tenant':
      pages = tenantPages;
      break;
    case 'landlord':
      pages = landlordPages;
      break;
    case 'admin':
      pages = adminPages;
      break;
    default:
      console.warn(`⚠️ Unknown role: "${role}". Defaulting to no role-based pages.`);
      pages = [];
  } 

  return {
    items: [
      {
        id: 'role-section',
        title: 'Dashboard',
        caption: 'Quick access',
        type: 'group',
        children: Array.isArray(pages) ? pages : []
      },
      {
        id: 'common-section',
        title: 'Explore the Web',
        type: 'group',
        children: commonPages
      }
    ]
  };
};

export default getMenuItemsByRole;
