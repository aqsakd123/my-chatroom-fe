import {useAuth} from "../auth/auth-context";

export default function Dashboard() {

    const { currentUser } = useAuth()

    return (
        <div>
            Dashboard
            {currentUser ?
                <div>
                    Hello, {currentUser?.displayName || currentUser?.email}
                </div>
                :
                <p>
                    Where do you think you're going stranger? Please login first here: <a href={'/login'}>Login</a>
                </p>
            }
            <div>
                This is the dashboard, you can use the chatroom in the Tab below talking in custom rooms.
            </div>
            <div>
                You can either use the profile in TopBar above to modify your user information.
            </div>
            <div>
                There are nothing in the dashboard.
            </div>
            <div>
                This is not an error.
            </div>
            <div>
                This is a feature.
            </div>

        </div>
    );
}