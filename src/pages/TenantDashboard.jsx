import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Container from '../components/common/Container.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { UserApi, SearchApi } from '../api/index.js';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [recsError, setRecsError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const sendLocationToServer = (position) => {
      const { latitude, longitude } = position.coords;
      UserApi.updateLocation({ latitude, longitude }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to update location', err);
      });
    };

    const handleError = (error) => {
      // eslint-disable-next-line no-console
      console.warn('Location permission denied or unavailable', error);
    };

    navigator.geolocation.getCurrentPosition(sendLocationToServer, handleError);

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(sendLocationToServer, handleError);
    }, 1800000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRecommendations = async () => {
      setIsLoadingRecs(true);
      setRecsError('');
      try {
        const { data } = await SearchApi.recommendations(user.id);
        setRecommendations(data.properties || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recommendations', err);
        const apiMessage = err?.response?.data?.message;
        setRecsError(apiMessage || 'Failed to load recommendations.');
      } finally {
        setIsLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [user?.id]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const { data } = await SearchApi.search(query);
      setSearchResults((data.results || []).map((item) => item.property));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Search failed', err);
      const apiMessage = err?.response?.data?.message;
      setSearchError(apiMessage || 'Failed to search properties.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const hasSearchResults = useMemo(
    () => searchResults && searchResults.length > 0,
    [searchResults],
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex flex-1">
        <Container className="py-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-soft sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                    Welcome, {user?.name || user?.email || 'Tenant'}
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Search for PGs, apartments, and homes using natural phrases like &quot;PG in
                    Guntur&quot; or &quot;AC house under 8000&quot;.
                  </p>
                </div>
                <Button variant="ghost" size="md" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              {user?.location && user.location.latitude && user.location.longitude && (
                <div className="mt-4 rounded-2xl bg-slate-900/80 p-4 text-xs text-slate-300">
                  <p className="font-medium text-slate-200">Your saved location</p>
                  <p className="mt-1">
                    Lat: {user.location.latitude.toFixed(5)}, Lng:{' '}
                    {user.location.longitude.toFixed(5)}
                  </p>
                </div>
              )}

              <form className="mt-6 space-y-3" onSubmit={handleSearch}>
                <label className="text-xs font-medium text-slate-200">
                  Smart search
                  <span className="ml-1 text-xs sm:text-[11px] font-normal text-slate-400">
                    (city, area, budget, amenities, property type)
                  </span>
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. PG in Guntur, house near Nagarampalem, AC room under 8000 with wifi"
                    className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-brand-500/60 transition focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
                  />
                  <Button
                    type="submit"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                {searchError && <p className="text-xs sm:text-[11px] text-rose-400">{searchError}</p>}
              </form>
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-100">Search Results</h2>
                {hasSearchResults && (
                  <span className="text-xs sm:text-[11px] text-slate-400">
                    {searchResults.length} matching properties
                  </span>
                )}
              </div>

              {!isSearching && !hasSearchResults && !searchError && query.trim() && (
                <p className="text-xs sm:text-[11px] text-slate-400">
                  No properties matched your search. Try changing the city, area, or budget.
                </p>
              )}

              {hasSearchResults && (
                <div className="grid gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((property) => {
                    const firstImage = property.images?.[0];
                    return (
                      <div
                        key={property._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/tenant/property/${property._id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            navigate(`/tenant/property/${property._id}`);
                          }
                        }}
                        className="cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-md transition hover:border-slate-600 hover:shadow-lg"
                      >
                        {firstImage ? (
                          <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-slate-900">
                            <img
                              src={firstImage}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-32 sm:h-40 w-full items-center justify-center bg-slate-900/80 text-xs text-slate-500">
                            No image
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="line-clamp-1 text-sm font-semibold text-slate-50">
                                {property.title}
                              </h3>
                              <p className="mt-0.5 text-xs sm:text-[11px] text-slate-400">
                                {property.location?.area}, {property.location?.city}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                              {property.propertyType}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-3 text-xs sm:text-[11px] text-slate-300">
                            {property.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[11px]">
                            <p className="font-semibold text-emerald-300">
                              ₹ {property.price?.toLocaleString('en-IN')}/month
                            </p>
                            <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] text-emerald-300">
                              Available
                            </span>
                          </div>

                          {property.amenities && property.amenities.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {property.amenities.slice(0, 4).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities.length > 4 && (
                                <span className="text-[10px] text-slate-500">
                                  +{property.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-100">
                  Recommended Properties for You
                </h2>
                {recommendations.length > 0 && (
                  <span className="text-xs sm:text-[11px] text-slate-400">
                    Based on your preferences &amp; location
                  </span>
                )}
              </div>

              {isLoadingRecs && (
                <p className="text-xs sm:text-[11px] text-slate-400">
                  Loading recommendations...
                </p>
              )}
              {recsError && <p className="text-xs sm:text-[11px] text-rose-400">{recsError}</p>}

              {!isLoadingRecs && recommendations.length === 0 && !recsError && (
                <p className="text-xs sm:text-[11px] text-slate-400">
                  No personalised recommendations yet. Update your preferences and start searching
                  to see smarter suggestions.
                </p>
              )}

              {recommendations.length > 0 && (
                <div className="grid gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((property) => {
                    const firstImage = property.images?.[0];
                    return (
                      <div
                        key={property._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/tenant/property/${property._id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            navigate(`/tenant/property/${property._id}`);
                          }
                        }}
                        className="cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-md transition hover:border-slate-600 hover:shadow-lg"
                      >
                        {firstImage ? (
                          <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-slate-900">
                            <img
                              src={firstImage}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-32 sm:h-40 w-full items-center justify-center bg-slate-900/80 text-xs text-slate-500">
                            No image
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="line-clamp-1 text-sm font-semibold text-slate-50">
                                {property.title}
                              </h3>
                              <p className="mt-0.5 text-xs sm:text-[11px] text-slate-400">
                                {property.location?.area}, {property.location?.city}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                              {property.propertyType}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-3 text-xs sm:text-[11px] text-slate-300">
                            {property.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[11px]">
                            <p className="font-semibold text-emerald-300">
                              ₹ {property.price?.toLocaleString('en-IN')}/month
                            </p>
                            <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] text-emerald-300">
                              Available
                            </span>
                          </div>

                          {property.amenities && property.amenities.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {property.amenities.slice(0, 4).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities.length > 4 && (
                                <span className="text-[10px] text-slate-500">
                                  +{property.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default TenantDashboard;

