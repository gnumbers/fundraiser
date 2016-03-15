import React, { Component } from 'react';
import CollapsableLine from '../CollapsableLine';
import ChildrenLine from '../ChildrenLine';
import AdminProjectForm from '../AdminProjectForm';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';

export default class AdminProjectsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: this.props.projects,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projects) {
            this.setState({
                projects: nextProps.projects,
            });
        }
    }

    newTeam = (team, projectIndex) => {
        const newState = Object.assign({}, this.state);

        newState.projects[projectIndex].teams.unshift(team);
        this.setState(newState);
    }

    updateTeam = (team, teamIndex, projectIndex) => {
        const newState = Object.assign({}, this.state);

        newState.projects[projectIndex].teams[teamIndex] = team;
        this.setState(newState);
    };

    updateProject = (project, projectIndex) => {
        const newState = Object.assign({}, this.state);

        newState.projects[projectIndex] = project;
        this.setState(newState);
    };

    render() {
        return (
            <div className="projects-table">
                <ul className="projects">
                    {this.state.projects.map((project, i) => (
                        <CollapsableLine key={i}
                            childrenContent={
                                <ul className="children-content clearfix">
                                    {project.teams ? project.teams.map((team, x) => (
                                        <ChildrenLine key={x}>
                                            <span className="label uppercase">{'Team Name: '}</span> {team.name}
                                            <span className="label uppercase">{'Raised: '}</span> {team.raised ? team.raised : 0}
                                            <span className="label uppercase">{'Average Pledge: '}</span> {team.pledge ? team.pledge : 0}
                                            <span className="label uppercase">{'$ / HR: '}</span> {team.pledgePerHour ? team.pledgePerHour : 0} {'/ hr'}
                                            <div className="edit-links">
                                                <ModalButton customClass="btn-link uppercase"
                                                    content={
                                                        <AdminTeamForm
                                                            title={"Edit team"}
                                                            defaultData={{
                                                                project,
                                                                team,
                                                            }}
                                                            updateTeam={(team, teamIndex) => {
                                                                this.updateTeam(team, x, i);
                                                            }}
                                                        />
                                                    }
                                                >
                                                    {'Edit'}
                                                </ModalButton>
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Remove'}</a>
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Invite Leader'}</a>
                                            </div>
                                        </ChildrenLine>
                                    )) : null}
                                </ul>
                            }
                        >
                            <div className="project-details">
                                <span className="label uppercase">{'Project Name: '}</span> {project.name}
                                <ModalButton customClass="btn-link uppercase"
                                    content={
                                        <AdminProjectForm title={"Edit Project"}
                                            defaultData={project}
                                            updateProject={(project) => {
                                                this.updateProject(project, i);
                                            }}
                                        />
                                    }
                                >
                                    {'Edit Project'}
                                </ModalButton>
                                <ModalButton customClass="btn-link uppercase"
                                    content={
                                        <AdminTeamForm
                                            title={"Add New Team"}
                                            defaultData={{
                                                project,
                                            }}
                                            newTeam={(team) => {
                                                this.newTeam(team, i);
                                            }}
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
