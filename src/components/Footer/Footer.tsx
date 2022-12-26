import React, { FC } from 'react';

import styles from './Footer.module.scss';

const Footer: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperInner}>
        <div className={styles.rsWrapper}>
          <a href="https://rs.school/react/" target="__blank">
            <img width="119" height="35" src="/assets/img/rs_school_js.svg" alt="" />
          </a>
        </div>
        <div className={styles.githubNames}>
          <div className={styles.githubItem}>
            <a className={styles.githubLink} href="https://github.com/ZmitserFurmanau" target="__blank">
              <span className={styles.githubName}>Zmitser Furmanau</span>
            </a>
          </div>
          <div className={styles.githubItem}>
            <a className={styles.githubLink} href="https://github.com/Glav-Tz" target="__blank">
              <span className={styles.githubName}>Anton Gorshkov</span>
            </a>
          </div>
          <div className={styles.githubItem}>
            <a className={styles.githubLink} href="https://github.com/alexandr2075" target="__blank">
              <span className={styles.githubName}>Alexandr Li</span>
            </a>
          </div>
        </div>
        <div>
          <div className={styles.copy}>© {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
