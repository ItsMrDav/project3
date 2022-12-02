import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const CommentPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  console.log("tryy");

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => console.log(formState), [formState]);

  const commentPlaceSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(placeId);
      await sendRequest(
        `http://localhost:8080/api/places/${placeId}`,
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/places/comments");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <h2>What Is Your Comment?</h2>
      <ErrorModal error={error} onClear={clearError} />

      <form onSubmit={commentPlaceSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Comment Title"
          onInput={inputHandler}
          value={formState.inputs.title.value}
          initialValid={false}
        />
        <Input
          id="description"
          element="textarea"
          label="Comment Description"
          onInput={inputHandler}
          value={formState.inputs.description.value}
          initialValid={false}
        />
        <Button type="submit">Add Comment</Button>
      </form>
    </>
  );
};

export default CommentPlace;
