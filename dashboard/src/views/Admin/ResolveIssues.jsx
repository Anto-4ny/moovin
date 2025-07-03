import React, { useState } from 'react';
import {
  Typography, Checkbox, List, ListItem, ListItemText, FormControlLabel
} from '@mui/material';

const mockIssues = [
  { id: 201, description: 'Leaking kitchen sink - Property ID 101', resolved: false },
  { id: 202, description: 'Power outage in unit - Property ID 102', resolved: false }
];

export default function ResolveIssues() {
  const [issues, setIssues] = useState(mockIssues);

  const toggleResolved = (id) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === id ? { ...issue, resolved: !issue.resolved } : issue
      )
    );
    console.log(`Marked issue ${id} as resolved/unresolved`);
    // Optionally send update to API here
  };

  return (
    <List dense>
      {issues.map(issue => (
        <ListItem key={issue.id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={issue.resolved}
                onChange={() => toggleResolved(issue.id)}
              />
            }
            label={issue.description}
          />
        </ListItem>
      ))}
    </List>
  );
}
