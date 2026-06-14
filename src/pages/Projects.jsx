import React from 'react';
import ProjectMatrix from '../components/Modules/ProjectMatrix';
import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';

const Projects = () => {
  return (
    <ProjectMatrix
      softwareProjects={softwareProjectsData}
      gameProjects={gameProjectsData}
    />
  );
};

export default Projects;
