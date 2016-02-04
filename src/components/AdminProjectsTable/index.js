import React, { Component } from 'react';
import CollapsableLine from '../CollapsableLine';
import ChildrenLine from '../ChildrenLine';
import AdminProjectForm from '../AdminProjectForm';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';

export default class AdminProjectsTable extends Component {
    render() {
        return (
            <div className="projects-table">
                <ul className="projects">
                    {this.props.projects.map((project, i) => (
                        <CollapsableLine key={i}
                            childrenContent={
                                <ul className="children-content clearfix">
                                    {project.teams.map((team, x) => (
                                        <ChildrenLine key={x}>
                                            <span className="label uppercase">Team Name: </span> {team.name}
                                            <span className="label uppercase">Raised: </span> {team.raised}
                                            <span className="label uppercase">Average Pledge: </span> {team.pledge}
                                            <span className="label uppercase">$ / HR: </span> {team.pledgePerHour} / hr
                                            <div className="edit-links">
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Edit'}</a>
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Remove'}</a>
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Invite Leader'}</a>
                                            </div>
                                        </ChildrenLine>
                                    ))}
                                </ul>
                            }
                        >
                            <div className="project-details">
                                <span className="project-name uppercase">Project Name: </span> {project.name}
                                <ModalButton type="btn-link uppercase"
                                    content={
                                        <AdminProjectForm title={"Edit Project"}
                                            project={project}
                                        />
                                    }
                                >
                                    {'Edit Project'}
                                </ModalButton>
                                <ModalButton type="btn-link uppercase"
                                    content={
                                        <AdminTeamForm title={"Add New Team"}
                                            project={project}
                                        />
                                    }
                                >
                                    {'New Team'}
                                </ModalButton>
                            </div>
                        </CollapsableLine>
                    ))}
                </ul>
            </div>
        );
    }
}

AdminProjectsTable.propTypes = {
    projects: React.PropTypes.array,
};
