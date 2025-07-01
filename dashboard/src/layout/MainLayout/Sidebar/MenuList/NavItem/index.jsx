import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';

// third party
import { useSelector, useDispatch } from 'react-redux';

// project import
import * as actionTypes from 'store/actions';

// fallback icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NavItem = ({ item, level = 1 }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();

  // icon handling
  const Icon = item.icon || ArrowForwardIcon;

  // Color logic: defaults to "inherit", can be overridden by item.iconColor (e.g. 'blue', '#fff')
  const iconColor = item.iconColor || 'inherit';

  const itemIcon = (
    <Icon
      sx={{
        fontSize: level > 0 ? 20 : 24,
        color: iconColor
      }}
    />
  );

  // Target and link logic
  const isExternal = item.external || false;
  const itemTarget = item.target || (isExternal ? '_blank' : undefined);

  const listItemProps = isExternal
    ? { component: 'a', href: item.url }
    : { component: Link, to: item.url };

  return (
    <ListItemButton
      disabled={item.disabled}
      sx={{
        ...(level > 1 && { backgroundColor: 'transparent !important', py: 1 }),
        borderRadius: '5px',
        mb: 0.5,
        pl: `${level * 16}px`
      }}
      selected={customization.isOpen === item.id}
      onClick={() => dispatch({ type: actionTypes.MENU_OPEN, isOpen: item.id })}
      target={itemTarget}
      {...listItemProps}
    >
      <ListItemIcon sx={{ minWidth: 25 }}>{itemIcon}</ListItemIcon>

      <ListItemText
        primary={
          <Typography
            sx={{ pl: 1.4 }}
            variant={customization.isOpen === item.id ? 'subtitle1' : 'body1'}
            color="inherit"
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.subMenuCaption, pl: 2 }}
              display="block"
              gutterBottom
            >
              {item.caption}
            </Typography>
          )
        }
      />

      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    iconColor: PropTypes.string,
    url: PropTypes.string.isRequired,
    target: PropTypes.string,
    external: PropTypes.bool,
    disabled: PropTypes.bool,
    caption: PropTypes.string,
    chip: PropTypes.shape({
      color: PropTypes.string,
      variant: PropTypes.string,
      size: PropTypes.string,
      label: PropTypes.string,
      avatar: PropTypes.string
    })
  }).isRequired,
  level: PropTypes.number
};

export default NavItem;
