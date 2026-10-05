let scrollAnimation;

function scrollToSection(target) {
  if (scrollAnimation) {
    cancelAnimationFrame(scrollAnimation);
  }

  const start = window.scrollY;
  const targetPosition =
    target.id === "top" ? 0 : target.getBoundingClientRect().top + start - 24;
  const distance = targetPosition - start;
  const duration = Math.min(1800, Math.max(1000, Math.abs(distance) * 0.6));
  let startTime;

  const animate = (time) => {
    if (startTime === undefined) {
      startTime = time;
    }

    const progress = Math.min((time - startTime) / duration, 1);
    const easedProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo({
      top: start + distance * easedProgress,
      behavior: "instant",
    });

    if (progress < 1) {
      scrollAnimation = requestAnimationFrame(animate);
    } else {
      scrollAnimation = undefined;
    }
  };

  scrollAnimation = requestAnimationFrame(animate);
}

document.querySelectorAll(".header-nav a[href*='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const destination = new URL(link.href, window.location.href);
    const isSamePage =
      destination.origin === window.location.origin &&
      destination.pathname === window.location.pathname;

    if (!isSamePage || !destination.hash) {
      return;
    }

    const targetId = decodeURIComponent(destination.hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    history.pushState(
      null,
      "",
      `${destination.pathname}${destination.search}${destination.hash}`,
    );
    scrollToSection(target);
  });
});

window.addEventListener("load", () => {
  if (!window.location.hash) {
    return;
  }

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(targetId);

  if (target) {
    window.scrollTo({ top: 0, behavior: "instant" });
    scrollToSection(target);
  }
});
