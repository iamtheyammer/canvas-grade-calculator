import React, { useEffect } from 'react';
import { Typography, List, Modal, Avatar } from 'antd';

import changelog from '../../../assets/changelog';

function UpdateHandler(props) {
  useEffect(() => {
    const currentVersion = parseInt(process.env.REACT_APP_CURRENT_VERSION);
    // OAuth2Handler sets the current version to equal previous version so that new users
    // don't see a full changelog on first login. Users who were already logged in will see
    // a full changelog, though.
    // we set it to the number that ends in 972 when it's not found because that will
    // show a full changelog.
    const prevVersion = isNaN(parseInt(localStorage.prevVersion))
      ? 1568909947971
      : parseInt(localStorage.prevVersion);

    const versionsAreValid =
      currentVersion &&
      prevVersion &&
      !isNaN(currentVersion) &&
      !isNaN(prevVersion);
    const shouldShowChangelog = currentVersion > prevVersion;

    if (!versionsAreValid) {
      localStorage.prevVersion = currentVersion;
      return;
    }

    function getIconByChangelogType(type) {
      let iconType = 'exclamation';
      let color = 'black';

      switch (type) {
        case 0:
          // update
          iconType = 'info-circle';
          color = 'orange';
          break;
        case 1:
          // new feature
          iconType = 'plus-circle';
          color = 'green';
          break;
        default:
          break;
      }

      return (
        <Avatar style={{ backgroundColor: '#FFFFFF', color }} icon={iconType} />
      );
    }

    if (shouldShowChangelog) {
      const availableUpdates = changelog.filter(
        cle => cle.timestamp > prevVersion
      );
      if (availableUpdates.length < 1) {
        return;
      }

      Modal.info({
        title: (
          <Typography.Text>
            New in version{' '}
            <Typography.Text code>{currentVersion}</Typography.Text>
          </Typography.Text>
        ),
        // this fixes an event where the reauth dialog comes up and the user
        // never sees the changelog
        onOk: () => {
          localStorage.prevVersion = currentVersion;
        },
        content: (
          <List
            itemLayout="horizontal"
            dataSource={availableUpdates}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={getIconByChangelogType(item.type)}
                  title={item.title}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        )
      });
    }
  }, []);

  return null;
}

export default UpdateHandler;
