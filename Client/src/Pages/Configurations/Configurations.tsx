import { CaretRightOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  CollapseProps,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  theme,
} from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import Movies from "./Movies/Movies";
import Theaters from "./Theaters/Theaters";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { BASE_URL } from "../../env";
import axios from "axios";
import { ITheater } from "../../Interfaces/theater.interface";
import { IMovie } from "../../Interfaces/movie.interface";
import dayjs from "dayjs";
import Shows from "./Shows/Shows";
import { IShow } from "../../Interfaces/show.interface";
import Analytics from "./Analytics/Analytics";

interface CreateTheater {
  name: string;
  address: string;
  technologies: Array<string>;
  cuisines: Array<string>;
  shows: Array<string>;
}

const Configurations = () => {
  const { token } = theme.useToken();
  const [isMoviesModalOpen, setIsMoviesModalOpen] = useState<boolean>(false);
  const [isTheatersModalOpen, setIsTheatersModalOpen] =
    useState<boolean>(false);
  const [isShowsModalOpen, setIsShowsModalOpen] = useState<boolean>(false);
  const [theaters, setTheaters] = useState<Array<ITheater>>();
  const [movies, setMovies] = useState<Array<IMovie>>();
  const [shows, setShows] = useState<Array<IShow>>();
  const [selectedMovie, setSelectedMovie] = useState<IMovie>();
  const [selectedTheater, setSelectedTheater] = useState<any>();
  const [selectedShow, setSelectedShow] = useState<IShow>();
  const [moviesOptions, setMoviesOptions] =
    useState<Array<{ label: string; value: number }>>();
  const [theaterOptions, setTheaterOptions] =
    useState<Array<{ label: string; value: number }>>();
  const [form] = useForm();

  useEffect(() => {
    console.log(isShowsModalOpen);
  }, [isShowsModalOpen]);

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const getTheaterOptions = (theaters: Array<ITheater>) => {
    let tempOptions: any = [];
    theaters.map((theater: ITheater) => {
      tempOptions.push({ label: theater.name, value: theater.id });
    });
    setTheaterOptions(tempOptions);
  };
  const getMovieOptions = (movies: Array<IMovie>) => {
    let tempOptions: any = [];
    movies.map((movie: IMovie) => {
      tempOptions.push({ label: movie.name, value: movie.id });
    });
    setMoviesOptions(tempOptions);
  };

  const getMovies = () => {
    axios
      .get(BASE_URL + "movie/movie")
      .then((res) => {
        setMovies(res.data.movies);
        getMovieOptions(res.data.movies);
      })
      .catch((e) => {
        message.error(e.message);
        console.log(e);
      });
  };

  useEffect(() => {
    getMovies();
  }, []);
  const getTheatres = () => {
    axios
      .get(BASE_URL + "/theater/theater")
      .then((res) => {
        setTheaters(res.data.theaters);
        getTheaterOptions(res.data.theaters);
      })
      .catch((e) => {
        message.error(e.message);
        console.log(e);
      });
  };

  useEffect(() => {
    getTheatres();
  }, []);
  const getShows = () => {
    axios
      .get(BASE_URL + "shows/shows")
      .then((res) => {
        setShows(res.data.shows);
      })
      .catch((e) => {
        message.error(e.message);
        console.log(e);
      });
  };

  useEffect(() => {
    getShows();
  }, []);

  const showModal = (type: string) => {
    console.log(type);
    if (type === "movies") setIsMoviesModalOpen(true);
    else if (type === "shows") {
      setIsShowsModalOpen(true);
    } else setIsTheatersModalOpen(true);
  };

  const handleCancel = (type: string) => {
    if (type === "movies") {
      setIsMoviesModalOpen(false);
    } else if (type === "shows") setIsShowsModalOpen(false);
    else setIsTheatersModalOpen(false);

    form.resetFields();
  };
  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => [
    {
      key: "1",
      label: "Movies",
      children: (
        <Movies
          showModal={showModal}
          movies={movies!}
          getMovies={getMovies}
          form={form}
          setSelectedMovie={setSelectedMovie}
        />
      ),
      style: panelStyle,
      extra: (
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            showModal("movies");
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Theaters",
      children: (
        <Theaters
          showModal={showModal}
          theaters={theaters!}
          getTheaters={getTheatres}
          setSelectedTheater={setSelectedTheater}
          form={form}
        />
      ),
      style: panelStyle,
      extra: (
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            showModal("theaters");
          }}
        />
      ),
    },
    {
      key: "3",
      label: "Shows",
      children: (
        <Shows
          shows={shows!}
          getShows={getShows}
          setSelectedShow={setSelectedShow}
          showModal={showModal}
          form={form}
        />
      ),
      style: panelStyle,
      extra: (
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            showModal("shows");
          }}
        />
      ),
    },
    {
      key: "4",
      label: "Analytics",
      children: <Analytics />,
      style: panelStyle,
      // extra: (
      //   <PlusCircleOutlined
      //     onClick={(e) => {
      //       e.stopPropagation();
      //       showModal("shows");
      //     }}
      //   />
      // ),
    },
  ];

  const CreateTheater = (data: any) => {
    console.log(selectedTheater, "selected theater");
    if (selectedTheater?.id === undefined) {
      axios
        .post(BASE_URL + "theater/theater", data)
        .then((res) => {
          console.log(res);
          message.success("Theater added successfully");
          handleCancel("theaters");

          getTheatres();
        })
        .catch((e) => {
          console.log(e);
          message.error(e.message);
          handleCancel("theaters");
        });
    } else {
      axios
        .patch(BASE_URL + "theater/theater/" + selectedTheater?.id, data)
        .then((res) => {
          console.log(res);
          message.success("Theater edited successfully");
          setSelectedTheater({} as ITheater);
          handleCancel("theaters");
          getTheatres();
        })
        .catch((e) => {
          console.log(e);
          message.error(e.message);
          setSelectedTheater({} as ITheater);
          handleCancel("theaters");
        });
    }
  };
  const CreateMovie = (data: any) => {
    console.log(data, "create movie");
    if (selectedMovie?.id === undefined) {
      axios
        .post(BASE_URL + "movie/movie", {
          ...data,
          start_date: dayjs(data?.start_date).format("YYYY-MM-DD"),
        })
        .then((res) => {
          message.success("Movie added successfully");
          console.log(res);
          handleCancel("movies");
          getMovies();
        })
        .catch((e) => {
          console.log(e);
          message.error(e.message);
          handleCancel("movies");
        });
    } else {
      axios
        .patch(BASE_URL + "movie/movie/" + selectedMovie.id, {
          ...data,
          start_date: dayjs(data?.start_date).format("YYYY-MM-DD"),
        })
        .then((res) => {
          console.log(res);
          message.success("Movie edited successfully");
          handleCancel("movies");
          setSelectedMovie({} as IMovie);
          getMovies();
        })
        .catch((e) => {
          console.log(e);
          message.error(e.message);
          handleCancel("movies");
        });
    }
  };

  const CreateShow = (data: any) => {
    console.log({
      ...data,
      start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(data.end_date).format("YYYY-MM-DD"),
    });
    axios
      .post(BASE_URL + "shows/create/shows", {
        ...data,
        start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(data.end_date).format("YYYY-MM-DD"),
      })
      .then((res) => {
        getShows();
        message.success("Show created successfully");
        handleCancel("shows");
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  return (
    <div>
      <Collapse
        bordered={false}
        defaultActiveKey={["1", "2", "4"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ background: token.colorBgContainer }}
        items={getItems(panelStyle)}
      />
      <Drawer
        title="Configure Movies"
        placement="right"
        onClose={() => handleCancel("movies")}
        open={isMoviesModalOpen}
        width={500}
      >
        <Form name="basic" autoComplete="off" form={form} layout="vertical">
          <Form.Item
            label="Movie Name"
            name="name"
            rules={[{ required: true, message: "Please input movie name!" }]}
          >
            <Input placeholder="Movie name" />
          </Form.Item>
          <Form.Item
            label="Movie Image URL"
            name="image_url"
            rules={[{ required: true, message: "Please input movie image!" }]}
          >
            <Input placeholder="Movie image url" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input movie description!" },
            ]}
          >
            <TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item
            label="Genre"
            name="genre"
            rules={[{ required: true, message: "Please input movie genre!" }]}
          >
            <Select
              allowClear
              className="w-full my-2"
              placeholder="Select Genre"
              options={[
                { value: "action", label: "Action" },
                { value: "thriller", label: "Thriller" },
                { value: "rom_com", label: "Rom Com" },
                { value: "horror", label: "Horror" },
                { value: "feel_good", label: "Feel Good" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Release date"
            name="start_date"
            rules={[
              { required: true, message: "Please input movie release date!" },
            ]}
          >
            <DatePicker
              placeholder="Select date"
              className="w-full"
              format={"YYYY-MM-DD"}
            />
          </Form.Item>
          <Form.Item
            label="Run time"
            name="runtime"
            rules={[{ required: true, message: "Please input movie runtime!" }]}
          >
            <InputNumber placeholder="Movie runtime" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please input movie rating!" }]}
          >
            <InputNumber placeholder="Movie rating" className="w-full" />
          </Form.Item>

          <div className="w-full">
            <Button
              className="w-full"
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                CreateMovie(form.getFieldsValue());
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
      <Drawer
        title="Configure Theaters"
        placement="right"
        onClose={() => handleCancel("theaters")}
        open={isTheatersModalOpen}
        width={500}
      >
        <Form name="basic" autoComplete="off" form={form} layout="vertical">
          <Form.Item
            label="Theater Name"
            name="name"
            rules={[
              { required: true, message: "Please input your theater name!" },
            ]}
          >
            <Input placeholder="Theater name" />
          </Form.Item>

          <Form.Item
            label="Theater Address"
            name="address"
            rules={[
              { required: true, message: "Please input theater address!" },
            ]}
          >
            <TextArea placeholder="Theater address" />
          </Form.Item>
          <div className="flex items-center w-full">
            <Form.Item
              label="No of rows"
              name="no_of_rows"
              className="w-full mr-2"
              rules={[
                {
                  required: true,
                  message: "Please input theater seating rows!",
                },
              ]}
            >
              <InputNumber placeholder="No of rows" className="w-full" />
            </Form.Item>
            <Form.Item
              label="No of columns"
              name="no_of_cols"
              className="w-full"
              rules={[
                {
                  required: true,
                  message: "Please input theater seating columns!",
                },
              ]}
            >
              <InputNumber placeholder="No of columns" className="w-full" />
            </Form.Item>
          </div>
          <Form.Item
            label="Screen Number"
            name="screen_number"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Please input theater screen number!",
              },
            ]}
          >
            <InputNumber placeholder="Screen Number" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Technologies"
            name="technologies"
            rules={[
              { required: true, message: "Please input theater technologies!" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={[
                {
                  label: "IMAX",
                  value: "imax",
                },
                {
                  label: "XD",
                  value: "xd",
                },
                {
                  label: "DOLBY ATMOS",
                  value: "dolby_atmos",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Cuisines"
            name="cuisines"
            rules={[
              { required: true, message: "Please input theater cuisines!" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={[
                {
                  label: "Restaurant",
                  value: "restaurant",
                },
                {
                  label: "Bar",
                  value: "bar",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Shows"
            name="shows"
            rules={[
              { required: true, message: "Please input theater show timings!" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={[
                {
                  label: "10:00 AM",
                  value: "10:00 AM",
                },
                {
                  label: "12:30 PM",
                  value: "12:30 PM",
                },
                {
                  label: "4:30 PM",
                  value: "4:30 PM",
                },
                {
                  label: "7:00 PM",
                  value: "7:00 PM",
                },
                {
                  label: "10:30 PM",
                  value: "10:30 PM",
                },
              ]}
            />
          </Form.Item>
          <div className="w-full">
            <Button
              className="w-full"
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                CreateTheater(form.getFieldsValue());
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
      <Drawer
        title="Configure Shows"
        placement="right"
        onClose={() => handleCancel("shows")}
        open={isShowsModalOpen}
        width={500}
      >
        <Form name="basic" form={form} layout="vertical">
          <Form.Item
            label="Movie"
            name="movie_id"
            rules={[{ required: true, message: "Please input movie name!" }]}
          >
            <Select
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={moviesOptions}
            />
          </Form.Item>

          <Form.Item
            label="Theaters"
            name="theater_id_list"
            rules={[
              { required: true, message: "Please input theater technologies!" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={theaterOptions}
            />
          </Form.Item>
          <Form.Item
            label="Start date"
            name="start_date"
            rules={[{ required: true, message: "Please input start date!" }]}
          >
            <DatePicker
              placeholder="Select date"
              className="w-full"
              format={"YYYY-MM-DD"}
            />
          </Form.Item>
          <Form.Item
            label="End date"
            name="end_date"
            rules={[{ required: true, message: "Please input end date!" }]}
          >
            <DatePicker
              placeholder="Select date"
              className="w-full"
              format={"YYYY-MM-DD"}
            />
          </Form.Item>
          <Form.Item
            label="Ticket Price ($)"
            name="price"
            rules={[{ required: true, message: "Please input end date!" }]}
          >
            <InputNumber placeholder="Ticket Price" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Discounted Ticket Price ($)"
            name="discounted_price"
            rules={[{ required: true, message: "Please input end date!" }]}
          >
            <InputNumber
              placeholder="Discounted Ticket Price"
              className="w-full"
            />
          </Form.Item>

          <div className="w-full">
            <Button
              className="w-full"
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                CreateShow(form.getFieldsValue());
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default Configurations;
