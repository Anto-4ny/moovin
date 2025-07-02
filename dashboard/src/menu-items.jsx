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

const commonPages = [
  {
    id: 'home',
    title: 'Home',
    type: 'item',
    icon: icons.HomeOutlinedIcon,
    url: 'https://moovin-eight.vercel.app/.html',
    external: true,
    iconColor: 'black'
  },
  {
    id: 'about',
    title: 'About',
    type: 'item',
    icon: icons.InfoOutlinedIcon,
    url: 'https://moovin-eight.vercel.app/about.html',
    external: true,
    iconColor: 'blue'
  },
  {
    id: 'services',
    title: 'Services',
    type: 'item',
    icon: icons.AppsOutlinedIcon,
    url: 'https://moovin-eight.vercel.app/services.html',
    external: true,
    iconColor: 'black'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    type: 'item',
    icon: icons.ContactSupportOutlinedIcon,
    url: '/contact',
    iconColor: 'blue'
  }
];

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
    title: 'Book Property',
    type: 'item',
    icon: icons.HomeWorkOutlinedIcon,
    url: '/book-property',
    iconColor: 'black'
  },
  {
    id: 'book-repair',
    title: 'Book Repair',
    type: 'item',
    icon: icons.BuildOutlinedIcon,
    url: '/book-repair',
    iconColor: 'blue'
  },
  {
    id: 'track-repair',
    title: 'Track Repair',
    type: 'item',
    icon: icons.TrackChangesOutlinedIcon,
    url: '/track-repair',
    iconColor: 'black'
  }
];

const landlordPages = [
  {
    id: 'landlord-dashboard',
    title: 'Landlord Dashboard',
    type: 'item',
    icon: icons.DashboardOutlinedIcon,
    url: '/dashboard/landlord',
    iconColor: 'blue'
  },
  {
    id: 'add-property',
    title: 'Add Property',
    type: 'item',
    icon: icons.DomainAddOutlinedIcon,
    url: '/add-property',
    iconColor: 'black'
  },
  {
    id: 'edit-property',
    title: 'Edit Property',
    type: 'item',
    icon: icons.EditOutlinedIcon,
    url: '/edit-property',
    iconColor: 'blue'
  },
  {
    id: 'manage-repairs',
    title: 'Manage Repairs',
    type: 'item',
    icon: icons.BuildOutlinedIcon,
    url: '/manage-repairs',
    iconColor: 'black'
  }
];

const adminPages = [
  {
    id: 'dashboard',
    title: 'Admin Dashboard',
    type: 'item',
    icon: icons.DashboardOutlinedIcon,
    url: '/dashboard/admin',
    iconColor: 'blue'
  },
  ...landlordPages,
  ...tenantPages
];

const getMenuItemsByRole = (role) => {
  let pages = [];

  if (role === 'tenant') {
    pages = tenantPages;
  } else if (role === 'landlord') {
    pages = landlordPages;
  } else if (role === 'admin') {
    pages = adminPages;
  }

  return {
    items: [
      {
        id: 'role-section',
        title: 'Dashboard',
        caption: 'Quick access',
        type: 'group',
        children: pages
      },
      {
        id: 'common-section',
        title: 'Explore',
        type: 'group',
        children: commonPages
      }
    ]
  };
};

export default getMenuItemsByRole;

