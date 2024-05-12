import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import {
  useGetAppStatusQuery,
  useGetProfileQuery,
} from "./gql/generated/schema";
import Matches from "./screens/Matches/Matches";
import Pronos from "./screens/Pronos/Pronos";
import TestPage from "./screens/TestPage";
import Nav from "./components/Nav/Nav";
import ChangePassword from "./screens/ChangePassword/ChangePassword";
import RequestChangingPassword from "./screens/RequestChangingPassword/RequestChangingPassword";
import Ranking from "./screens/Ranking/Ranking";
import MyProfile from "./screens/MyProfile/MyProfile";
import Admin from "./screens/Admin/Admin";

function App() {
  const { data: current, refetch } = useGetProfileQuery({
    errorPolicy: "ignore",
  });
  const userIsLogged = current?.profile?.id;
  const userRole = current?.profile?.role;
  const profile = current?.profile;

  const { data: appStatus, refetch: refetchAppStatus } = useGetAppStatusQuery();

  const app = appStatus?.getAppStatus.predictionsAreActivated || false;
  const roundOf16 =
    appStatus?.getAppStatus.predictionsRoundOf16Activated || false;
  const quarterFinals =
    appStatus?.getAppStatus.predictionsQuarterFinalsActivated || false;
  const semiFinals =
    appStatus?.getAppStatus.predictionsSemiFinalsActivated || false;
  const final = appStatus?.getAppStatus.predictionsFinalActivated || false;

  const [refetchPronos, setRefetchPronos] = useState(false);

  const handlePredictionSetting = () => {
    refetchAppStatus();
  };

  const refreshPronos = () => {
    setRefetchPronos(true);
  };

  const refreshUserProfile = () => {
    refetch();
  };

  return (
    <Routes>
      <Route path={"/"} element={<HomePage userProfile={profile} />} />
      <Route path={"/sign-up"} element={<SignUp />} />
      <Route path={"/login"} element={<Login />} />
      <Route
        path={"/change-password/:id/:token"}
        element={<ChangePassword />}
      />
      <Route
        path={"/request-changing-password"}
        element={<RequestChangingPassword />}
      />

      {userIsLogged && (
        <>
          <Route
            path={"/tous-les-matches"}
            element={
              <Nav>
                <Matches
                  userId={current?.profile?.id}
                  groupPredictionsAreActivated={app}
                  roundOf16PredictionsAreActivated={roundOf16}
                  quarterPredictionsAreActivated={quarterFinals}
                  semiFinalsPredictionsAreActivated={semiFinals}
                  finalPredictionsAreActivated={final}
                  refreshPronos={refreshPronos}
                />
              </Nav>
            }
          />
          <Route
            path={"/tous-les-pronos"}
            element={
              <Nav>
                <Pronos
                  refetchPronos={refetchPronos}
                  userId={current?.profile?.id}
                />
              </Nav>
            }
          />
          <Route
            path={"/classement"}
            element={
              <Nav>
                <Ranking />
              </Nav>
            }
          />
          <Route
            path={"/profil"}
            element={
              <MyProfile
                userProfile={profile}
                refreshUserProfile={refreshUserProfile}
              />
            }
          />
          <Route path={"/test"} element={<TestPage />} />

          {userIsLogged && userRole === "admin" && (
            <>
              <Route
                path={"/admin"}
                element={
                  <Admin
                    handlePredictionSetting={handlePredictionSetting}
                    groupPredictionsAreActivated={app}
                    roundOf16PredictionsAreActivated={roundOf16}
                    quarterPredictionsAreActivated={quarterFinals}
                    semiFinalsPredictionsAreActivated={semiFinals}
                    finalPredictionsAreActivated={final}
                  />
                }
              />
            </>
          )}
        </>
      )}
    </Routes>
  );
}

export default App;
