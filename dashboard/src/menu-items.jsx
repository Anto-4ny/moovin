// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';

const icons = {
  NavigationOutlinedIcon,
  HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon,
  AccountTreeOutlinedIcon,
  BlockOutlinedIcon,
  AppsOutlinedIcon,
  ContactSupportOutlinedIcon,
  BuildOutlinedIcon,
  DomainAddOutlinedIcon,
  EditOutlinedIcon,
  SupportAgentOutlinedIcon,
  InfoOutlinedIcon,
  HomeWorkOutlinedIcon,
  TrackChangesOutlinedIcon
};

// ==============================|| DYNAMIC MENU FUNCTION ||============================== //

const getMenuItemsByRole = (role) => {
  const commonPages = [
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      icon: icons['HomeOutlinedIcon'],
      url: '/home'
    },
    {
      id: 'about',
      title: 'About',
      type: 'item',
      icon: icons['InfoOutlinedIcon'],
      url: '/about'
    },
    {
      id: 'services',
      title: 'Services',
      type: 'item',
      icon: icons['AppsOutlinedIcon'],
      url: '/services'
    },
    {
      id: 'support',
      title: 'Support',
      type: 'item',
      icon: icons['SupportAgentOutlinedIcon'],
      url: '/support'
    },
    {
      id: 'contact',
      title: 'Contact',
      type: 'item',
      icon: icons['ContactSupportOutlinedIcon'],
      url: '/contact'
    }
  ];

  const roleSpecific = {
    admin: [
      {
        id: 'admin-dashboard',
        title: 'Admin Dashboard',
        type: 'item',
        icon: icons['NavigationOutlinedIcon'],
        url: '/dashboardd'
      }
    ],
    tenant: [
      {
        id: 'tenant-dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: icons['NavigationOutlinedIcon'],
        url: '/dashboard'
      },
      {
        id: 'book-property',
        title: 'Book Property',
        type: 'item',
        icon: icons['HomeWorkOutlinedIcon'],
        url: '/tenant/book-property'
      },
      {
        id: 'book-repair',
        title: 'Book Repair',
        type: 'item',
        icon: icons['BuildOutlinedIcon'],
        url: '/tenant/book-repair'
      },
      {
        id: 'track-repair',
        title: 'Track Repair',
        type: 'item',
        icon: icons['TrackChangesOutlinedIcon'],
        url: '/tenant/track-repair'
      }
    ],
    landlord: [
      {
        id: 'landlord-dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: icons['NavigationOutlinedIcon'],
        url: '/dashboard'
      },
      {
        id: 'manage-property',
        title: 'Manage Property',
        type: 'item',
        icon: icons['HomeWorkOutlinedIcon'],
        url: '/landlord/manage-property'
      },
      {
        id: 'add-property',
        title: 'Add Property',
        type: 'item',
        icon: icons['DomainAddOutlinedIcon'],
        url: '/landlord/add-property'
      },
      {
        id: 'edit-property',
        title: 'Edit Property',
        type: 'item',
        icon: icons['EditOutlinedIcon'],
        url: '/landlord/edit-property'
      }
    ]
  };

  return {
    items: [
      {
        id: 'navigation',
        title: 'Moovin',
        caption: 'Main Navigation',
        type: 'group',
        icon: icons['NavigationOutlinedIcon'],
        children: [...(roleSpecific[role] || [])]
      },
      {
        id: 'common',
        title: 'More',
        type: 'group',
        icon: icons['AccountTreeOutlinedIcon'],
        children: commonPages
      }
    ]
  };
};

export default getMenuItemsByRole;

